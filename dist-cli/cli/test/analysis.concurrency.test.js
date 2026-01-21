import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Analyzer } from '../analysis.js';
// Mock fs/promises
const mockReaddir = vi.fn();
const mockReadFile = vi.fn();
const mockStat = vi.fn();
const mockAccess = vi.fn();
const mockMkdir = vi.fn();
const mockWriteFile = vi.fn();
const mockRename = vi.fn();
vi.mock('fs/promises', () => ({
    default: {
        readdir: (...args) => mockReaddir(...args),
        readFile: (...args) => mockReadFile(...args),
        stat: (...args) => mockStat(...args),
        access: (...args) => mockAccess(...args),
        mkdir: (...args) => mockMkdir(...args),
        writeFile: (...args) => mockWriteFile(...args),
        rename: (...args) => mockRename(...args),
    },
}));
// Mock @wakaru/unpacker
const mockUnpack = vi.fn();
vi.mock('@wakaru/unpacker', () => ({
    unpack: (...args) => mockUnpack(...args)
}));
// Mock beautify
vi.mock('../beautify.js', () => ({
    beautify: (code) => Promise.resolve(`/* beautified */ ${code}`)
}));
// Mock humanifyjs
const mockHumanifyCode = vi.fn();
vi.mock('humanifyjs/lib', () => ({
    humanifyCode: (...args) => mockHumanifyCode(...args)
}));
describe('Concurrency and Humanify', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mocks
        mockStat.mockResolvedValue({ size: 100 });
        mockUnpack.mockResolvedValue({ modules: [] });
    });
    it('respects concurrency limit', async () => {
        // Setup 10 files
        const files = Array.from({ length: 10 }, (_, i) => `file${i}.js`);
        mockReaddir.mockResolvedValue(files.map(name => ({ name, isFile: () => true, isDirectory: () => false })));
        let concurrentCalls = 0;
        let maxConcurrentCalls = 0;
        mockReadFile.mockImplementation(async () => {
            concurrentCalls++;
            maxConcurrentCalls = Math.max(maxConcurrentCalls, concurrentCalls);
            await new Promise(resolve => setTimeout(resolve, 10)); // Simulate IO
            concurrentCalls--;
            return 'function foo() {}';
        });
        const analyzer = new Analyzer();
        const concurrency = 3;
        const result = await analyzer.processDirectory('/tmp', { concurrency });
        expect(result.success).toBe(true);
        expect(maxConcurrentCalls).toBeLessThanOrEqual(concurrency);
        expect(mockReadFile).toHaveBeenCalledTimes(10);
    });
    it('handles concurrent post-processing correctly', async () => {
        // Setup 5 files
        const files = Array.from({ length: 5 }, (_, i) => `file${i}.js`);
        mockReaddir.mockResolvedValue(files.map(name => ({ name, isFile: () => true, isDirectory: () => false })));
        mockStat.mockResolvedValue({ size: 100 });
        // Mock logic:
        // Access fails (output not present)
        mockAccess.mockRejectedValue(new Error('ENOENT'));
        mockReadFile.mockResolvedValue('const a=1;');
        const analyzer = new Analyzer();
        const options = {
            concurrency: 5,
            disableUnpacking: true,
            postProcess: {
                enabled: true,
                inputRoot: '/input',
                outputDir: '/output',
                archiveDir: '/archive',
                dupesDir: '/dupes'
            }
        };
        await analyzer.processDirectory('/input', options);
        // Verify writes and moves
        expect(mockWriteFile).toHaveBeenCalledTimes(5);
        expect(mockRename).toHaveBeenCalledTimes(5);
    });
    it('integrates humanify correctly', async () => {
        mockReaddir.mockResolvedValue([
            { name: 'main.js', isFile: () => true, isDirectory: () => false }
        ]);
        mockReadFile.mockResolvedValue('function a() {}');
        mockHumanifyCode.mockResolvedValue('function humanified() {}');
        const analyzer = new Analyzer();
        const result = await analyzer.processDirectory('/tmp', {
            enabled: true,
            scope: 'source',
            apiKey: 'fake-key',
            concurrency: 1
        });
        expect(mockHumanifyCode).toHaveBeenCalledWith('function a() {}', expect.objectContaining({ apiKey: 'fake-key' }));
        // Check if the node extracted matches the humanified code
        if (!result.success)
            throw new Error(result.error);
        const humanifiedNode = result.data.nodes.find(n => n.label === 'humanified');
        expect(humanifiedNode).toBeDefined();
    });
    it('handles humanify errors gracefully', async () => {
        mockReaddir.mockResolvedValue([
            { name: 'error.js', isFile: () => true, isDirectory: () => false }
        ]);
        mockReadFile.mockResolvedValue('function a() {}');
        mockHumanifyCode.mockRejectedValue(new Error('API Error'));
        const analyzer = new Analyzer();
        const result = await analyzer.processDirectory('/tmp', {
            enabled: true,
            concurrency: 1
        });
        expect(result.success).toBe(true);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings[0]).toContain('humanify failed');
        // Should fall back to original code
        if (!result.success)
            throw new Error(result.error);
        const originalNode = result.data.nodes.find(n => n.label === 'a');
        expect(originalNode).toBeDefined();
    });
    it('merges results from multiple files correctly', async () => {
        mockReaddir.mockResolvedValue([
            { name: 'a.js', isFile: () => true, isDirectory: () => false },
            { name: 'b.js', isFile: () => true, isDirectory: () => false }
        ]);
        mockReadFile.mockImplementation((path) => {
            if (path.includes('a.js'))
                return Promise.resolve('function shared() {}');
            if (path.includes('b.js'))
                return Promise.resolve('function shared() {}');
            return Promise.resolve('');
        });
        const analyzer = new Analyzer();
        const result = await analyzer.processDirectory('/tmp', { concurrency: 2 });
        // Both files define 'shared'. The ID will be prefixed by file path, so they are distinct nodes.
        // wait, local analysis prefixes ids with ctx.path.
        // So a.js::shared and b.js::shared.
        if (!result.success)
            throw new Error(result.error);
        expect(result.data.nodes.length).toBeGreaterThan(0);
        const nodes = result.data.nodes.filter(n => n.label === 'shared');
        expect(nodes.length).toBe(2);
        // If we want to test merging of shared edges (e.g. if we had cross-file dependencies somehow?
        // But current logic adds edges with file-specific IDs, unless we manually created cross-file edges
        // which `analyzeModule` doesn't do except via imports if we resolved them.
        // Currently `analyzeModule` only links inside the module).
        // However, edgeSet ensures no duplicate edges if they were exactly same ID.
    });
});
