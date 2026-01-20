import { format } from 'prettier'

export async function beautify(code: string): Promise<string> {
  try {
    return await format(code, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 100,
    })
  } catch (err) {
    console.warn('Beautification failed:', err)
    return code
  }
}
