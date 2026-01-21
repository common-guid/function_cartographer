import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Analyzer } from './analysis.js';
import * as humanifyLib from 'humanifyjs/lib';
import fs from 'fs/promises';
import path from 'path';
// Mock fs and humanifyjs
vi.mock('fs/promises');
vi.mock('humanifyjs/lib', () => ({
    humanifyCode: vi.fn(async (code) => code + '\n// humanified'),
}));
describe('Analyzer with Humanify', () => {
    const mockDir = '/mock/dir';
    const mockFile = path.join(mockDir, 'test.js');
    const mockCode = 'function a() { return 1; }';
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(fs.readdir).mockResolvedValue([
            { name: 'test.js', isDirectory: () => false, isFile: () => true }
        ]);
        vi.mocked(fs.stat).mockResolvedValue({ size: 100 });
        vi.mocked(fs.readFile).mockResolvedValue(mockCode);
    });
    it('should call humanifyCode when enabled and scope matches', async () => {
        const analyzer = new Analyzer();
        const options = {
            enabled: true,
            scope: 'source', // test.js will be detected as source
            apiKey: 'test-key',
            model: 'test-model'
        };
        const result = await analyzer.processDirectory(mockDir, options);
        expect(result.success).toBe(true);
        expect(humanifyLib.humanifyCode).toHaveBeenCalledWith(mockCode, options);
        // The graph should reflect the humanified code (mock adds comment)
        // We can't easily check the graph content for the comment, but the call verification is key.
    });
    it('should NOT call humanifyCode when disabled', async () => {
        const analyzer = new Analyzer();
        const options = {
            enabled: false,
            scope: 'source',
            apiKey: 'test-key'
        };
        const result = await analyzer.processDirectory(mockDir, options);
        expect(result.success).toBe(true);
        expect(humanifyLib.humanifyCode).not.toHaveBeenCalled();
    });
    it('should NOT call humanifyCode for vendor files if scope is source', async () => {
        const vendorFile = path.join(mockDir, 'node_modules', 'lib.js');
        vi.mocked(fs.readdir).mockResolvedValue([
            { name: 'node_modules', isDirectory: () => true, isFile: () => false }
        ]);
        // Mock nested readdir
        vi.mocked(fs.readdir).mockImplementation(async (dir) => {
            const dirStr = String(dir);
            if (dirStr === mockDir)
                return [{ name: 'node_modules', isDirectory: () => true, isFile: () => false }];
            if (dirStr.includes('node_modules'))
                return [{ name: 'lib.js', isDirectory: () => false, isFile: () => true }];
            return [];
        });
        vi.mocked(fs.stat).mockResolvedValue({ size: 100 });
        vi.mocked(fs.readFile).mockResolvedValue(mockCode);
        const analyzer = new Analyzer();
        const options = {
            enabled: true,
            scope: 'source',
            apiKey: 'test-key'
        };
        await analyzer.processDirectory(mockDir, options);
        // Should not be called for vendor file
        expect(humanifyLib.humanifyCode).not.toHaveBeenCalled();
    });
    it('should call humanifyCode for vendor files if scope is all', async () => {
        // Setup similar to above but with scope 'all'
        const vendorDir = path.join(mockDir, 'node_modules');
        const vendorFile = path.join(vendorDir, 'lib.js');
        vi.mocked(fs.readdir).mockImplementation(async (dir) => {
            if (dir === mockDir)
                return [{ name: 'node_modules', isDirectory: () => true, isFile: () => false }];
            if (dir === vendorDir)
                return [{ name: 'lib.js', isDirectory: () => false, isFile: () => true }];
            return [];
        });
        vi.mocked(fs.stat).mockResolvedValue({ size: 100 });
        vi.mocked(fs.readFile).mockResolvedValue(mockCode);
        const analyzer = new Analyzer();
        const options = {
            enabled: true,
            scope: 'all',
            apiKey: 'test-key'
        };
        await analyzer.processDirectory(mockDir, options);
        expect(humanifyLib.humanifyCode).toHaveBeenCalled();
    });
});
