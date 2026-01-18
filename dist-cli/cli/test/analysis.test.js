import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Analyzer, moduleIdFromPath, detectTags, scoreConfidence } from '../analysis.js';
// Mock fs/promises
const mockReaddir = vi.fn();
const mockReadFile = vi.fn();
const mockStat = vi.fn();
vi.mock('fs/promises', () => ({
    default: {
        readdir: (...args) => mockReaddir(...args),
        readFile: (...args) => mockReadFile(...args),
        stat: (...args) => mockStat(...args),
    },
}));
describe('Analysis Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
            // Mock file structure: /tmp/test/main.js
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
                // Should find the function 'hello'
                const fnNode = result.data.nodes.find(n => n.id.includes('hello'));
                expect(fnNode).toBeDefined();
            }
        });
    });
});
