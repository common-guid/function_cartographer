import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Analyzer, moduleIdFromPath, detectTags, scoreConfidence } from '../analysis.js';
import path from 'path';
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
describe('Analysis Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUnpack.mockResolvedValue({ modules: [] });
        mockHumanifyCode.mockResolvedValue('HUMANIFIED_CODE');
    });
    describe('Helpers', () => {
        it('moduleIdFromPath strips .js extension', () => {
            expect(moduleIdFromPath('foo/bar.js')).toBe('foo/bar');
            expect(moduleIdFromPath('foo/bar')).toBe('foo/bar');
        });
        it('detectTags identifies vendor code', () => {
            expect(detectTags('node_modules/foo.js', '')).toContain('vendor');
            expect(detectTags('src/main.js', '')).toContain('source');
        });
        it('detectTags identifies boilerplate', () => {
            expect(detectTags('bundle.js', '__webpack_require__')).toContain('boilerplate');
        });
        it('scoreConfidence clamps values', () => {
            expect(scoreConfidence('low', 1)).toBe('medium');
            expect(scoreConfidence('medium', 1)).toBe('high');
            expect(scoreConfidence('high', 1)).toBe('high');
            expect(scoreConfidence('high', -1)).toBe('medium');
        });
    });
    describe('Analyzer', () => {
        it('processDirectory handles empty directory', async () => {
            mockReaddir.mockResolvedValue([]);
            const analyzer = new Analyzer();
            const result = await analyzer.processDirectory('/tmp/test');
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toContain('No JS bundles found');
            }
        });
        it('processDirectory analyzes a single file', async () => {
            mockReaddir.mockResolvedValue([
                { name: 'main.js', isFile: () => true, isDirectory: () => false }
            ]);
            mockStat.mockResolvedValue({ size: 100 });
            mockReadFile.mockResolvedValue('function hello() {}');
            const analyzer = new Analyzer();
            const result = await analyzer.processDirectory('/tmp/test');
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.nodes.length).toBeGreaterThan(0);
                const fileNode = result.data.nodes.find(n => n.id === 'file:main.js');
                expect(fileNode).toBeDefined();
            }
        });
        it('postProcess: new file -> write output -> move input', async () => {
            const inputDir = path.resolve('/input');
            const outputDir = path.resolve('/output');
            const archiveDir = path.resolve('/archive');
            const dupesDir = path.resolve('/dupes');
            mockReaddir.mockResolvedValue([
                { name: 'main.js', isFile: () => true, isDirectory: () => false }
            ]);
            mockStat.mockResolvedValue({ size: 100 });
            mockReadFile.mockResolvedValue('const a=1;');
            mockAccess.mockRejectedValue(new Error('ENOENT')); // Output does not exist
            const analyzer = new Analyzer();
            const options = {
                postProcess: {
                    enabled: true,
                    inputRoot: inputDir,
                    outputDir: outputDir,
                    archiveDir: archiveDir,
                    dupesDir: dupesDir
                },
                disableUnpacking: true
            };
            await analyzer.processDirectory(inputDir, options);
            // Verify output check
            const expectedOutputPath = path.join(outputDir, 'main.js');
            expect(mockAccess).toHaveBeenCalledWith(expectedOutputPath);
            // Verify input read
            const expectedInputPath = path.join(inputDir, 'main.js');
            expect(mockReadFile).toHaveBeenCalledWith(expectedInputPath, 'utf-8');
            // Verify Unpack skipped
            expect(mockUnpack).not.toHaveBeenCalled();
            // Verify Write Output
            expect(mockWriteFile).toHaveBeenCalledWith(expectedOutputPath, expect.stringContaining('/* beautified */'));
            // Verify Move Input
            const expectedArchivePath = path.join(archiveDir, 'main.js');
            expect(mockRename).toHaveBeenCalledWith(expectedInputPath, expectedArchivePath);
        });
        it('postProcess: cached output -> read output -> move input to dupes', async () => {
            const inputDir = path.resolve('/input');
            const outputDir = path.resolve('/output');
            const archiveDir = path.resolve('/archive');
            const dupesDir = path.resolve('/dupes');
            mockReaddir.mockResolvedValue([
                { name: 'main.js', isFile: () => true, isDirectory: () => false }
            ]);
            mockStat.mockResolvedValue({ size: 100 });
            mockAccess.mockResolvedValue(undefined); // Exists
            mockReadFile.mockImplementation((p) => {
                if (p.includes('output'))
                    return Promise.resolve('CACHED_CONTENT');
                return Promise.resolve('INPUT_CONTENT');
            });
            const analyzer = new Analyzer();
            const options = {
                postProcess: {
                    enabled: true,
                    inputRoot: inputDir,
                    outputDir: outputDir,
                    archiveDir: archiveDir,
                    dupesDir: dupesDir
                },
                disableUnpacking: true
            };
            await analyzer.processDirectory(inputDir, options);
            // Should read CACHED content
            const expectedOutputPath = path.join(outputDir, 'main.js');
            expect(mockReadFile).toHaveBeenCalledWith(expectedOutputPath, 'utf-8');
            // Should move input to dupes (since archive check passed via mockAccess returning success)
            const expectedDupesPath = path.join(dupesDir, 'main.js');
            const expectedInputPath = path.join(inputDir, 'main.js');
            expect(mockRename).toHaveBeenCalledWith(expectedInputPath, expectedDupesPath);
        });
        it('postProcess: vendor file skipped by humanify -> fallback to beautify', async () => {
            const inputDir = path.resolve('/input');
            const outputDir = path.resolve('/output');
            // Mock recursive readdir for node_modules/vendor.js
            mockReaddir.mockImplementation((dir) => {
                if (dir === inputDir)
                    return Promise.resolve([{ name: 'node_modules', isDirectory: () => true, isFile: () => false }]);
                if (dir.endsWith('node_modules'))
                    return Promise.resolve([{ name: 'vendor.js', isDirectory: () => false, isFile: () => true }]);
                return Promise.resolve([]);
            });
            mockStat.mockResolvedValue({ size: 100 });
            mockReadFile.mockResolvedValue('var x=1;');
            mockAccess.mockRejectedValue(new Error('ENOENT')); // Output missing
            const analyzer = new Analyzer();
            const options = {
                enabled: true,
                scope: 'source',
                postProcess: {
                    enabled: true,
                    inputRoot: inputDir,
                    outputDir: outputDir,
                    archiveDir: '/archive',
                    dupesDir: '/dupes'
                },
                disableUnpacking: true
            };
            await analyzer.processDirectory(inputDir, options);
            // Should NOT call humanify (because vendor)
            expect(mockHumanifyCode).not.toHaveBeenCalled();
            // Should call beautify (fallback)
            expect(mockWriteFile).toHaveBeenCalledWith(expect.stringContaining('vendor.js'), expect.stringContaining('/* beautified */'));
        });
    });
});
