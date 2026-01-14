import * as Comlink from 'comlink';
import * as acorn from 'acorn';

export class AnalysisWorker {
    async processDirectory(handle: FileSystemDirectoryHandle) {
        console.log("Worker received directory handle:", handle.name);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy graph data
        const nodes = [
            { key: "root", attributes: { x: 0, y: 0, size: 20, label: "Root", color: "#FA4F40" } },
            { key: "modA", attributes: { x: 15, y: 5, size: 10, label: "Module A", color: "#40FAFA" } },
            { key: "modB", attributes: { x: 15, y: -5, size: 10, label: "Module B", color: "#40FAFA" } },
            { key: "util", attributes: { x: 30, y: 0, size: 5, label: "Utils", color: "#808080" } }
        ];
        const edges = [
            { source: "root", target: "modA" },
            { source: "root", target: "modB" },
            { source: "modA", target: "util" },
            { source: "modB", target: "util" }
        ];

        return {
            success: true,
            data: { nodes, edges }
        };
    }

    async parseCode(code: string) {
        try {
            const ast = acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'module'
            });
            return { success: true, astType: ast.type };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }
}

Comlink.expose(new AnalysisWorker());
