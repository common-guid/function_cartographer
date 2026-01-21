
import babel from "./plugins/babel/babel.js";
import prettier from "./plugins/prettier.js";
import { openrouterRename } from "./plugins/openrouter/openrouter-rename.js";
import { verbose } from "./verbose.js";
import { parseNumber } from "./number-utils.js";
import { DEFAULT_CONTEXT_WINDOW_SIZE } from "./commands/default-args.js";

export type HumanifyOptions = {
    apiKey?: string;
    baseURL?: string;
    model?: string;
    contextSize?: number | string;
    verbose?: boolean;
    onProgress?: (percentage: number) => void;
};

export async function humanifyCode(code: string, options: HumanifyOptions = {}): Promise<string> {
    if (options.verbose) {
        verbose.enabled = true;
    }

    const apiKey = options.apiKey;
    const baseURL = options.baseURL ?? "https://openrouter.ai/api/v1";
    const model = options.model ?? "x-ai/grok-4.1-fast";
    const contextWindowSize = parseNumber(options.contextSize ?? DEFAULT_CONTEXT_WINDOW_SIZE);
    const onProgress = options.onProgress;

    if (!apiKey) {
        throw new Error("API Key is required for OpenRouter humanification.");
    }

    const plugins = [
        babel,
        openrouterRename({
            apiKey,
            baseURL,
            model,
            contextWindowSize,
            onProgress
        }),
        prettier
    ];

    const formattedCode = await plugins.reduce(
        (p, next) => p.then(next),
        Promise.resolve(code)
    );

    return formattedCode;
}
