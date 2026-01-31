declare module 'humanifyjs/lib' {
  export interface HumanifyOptions {
    apiKey?: string;
    model?: string;
    [key: string]: any;
  }

  export function humanifyCode(code: string, options?: HumanifyOptions): Promise<string>;
}