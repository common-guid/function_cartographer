#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Only inject if not already present
if (typeof global.require === 'undefined') {
  global.require = require;
}

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import dotenv from 'dotenv'
import { ensureUiBuild } from './uiBuild.js'

// Load environment variables from .env file
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

program
  .name('js-lens')
  .description('JS-Lens CLI')
  .version('0.1.0')

program
  .command('serve <dir>')
  .description('Analyze a directory and serve the visualization')
  .option('-p, --port <number>', 'Port to run the server on', '3000')
  .option('--no-build-ui', 'Skip rebuilding the UI when dist is missing or stale')
  .option('--humanify', 'Enable LLM-based humanification (requires API key)')
  .option('--humanify-scope <scope>', 'Scope of humanification: "source" (default) or "all"', 'source')
  .action(async (dir, options) => {
    // Dynamic import to ensure global.require is set before Analyzer is imported/executed
    const { Analyzer } = await import('./analysis.js');

    const targetDir = path.resolve(process.cwd(), dir)
    console.log(`Analyzing directory: ${targetDir}`)

    const app = express()
    const port = parseInt(options.port, 10)

    app.use(cors())

    const analyzer = new Analyzer()
    let cachedResult: any = null

    // Configure Humanify options
    const humanifyOptions = options.humanify ? {
      enabled: true,
      scope: options.humanifyScope,
      apiKey: process.env.HUMANIFY_OPENROUTER_API_KEY,
      model: process.env.HUMANIFY_PLUS_MODEL
    } : undefined;

    if (humanifyOptions?.enabled && !humanifyOptions.apiKey) {
      console.error('Error: --humanify is enabled but HUMANIFY_OPENROUTER_API_KEY is missing in environment variables or .env file.');
      process.exit(1);
    }

    // Run analysis immediately
    try {
      console.log('Starting analysis...')
      cachedResult = await analyzer.processDirectory(targetDir, humanifyOptions)
      console.log('Analysis complete.')
    } catch (err) {
      console.error('Analysis failed:', err)
      cachedResult = { success: false, error: String(err), warnings: [] }
    }

    app.get('/api/graph', (_req, res) => {
      if (cachedResult) {
        res.json(cachedResult)
      } else {
        res.status(503).json({ error: 'Analysis in progress' })
      }
    })

    const projectRoot = path.resolve(__dirname, '../..')
    if (options.buildUi) {
      try {
        await ensureUiBuild(projectRoot)
      } catch (err) {
        console.error('UI build failed:', err)
        process.exit(1)
      }
    }

    // Serve static files from the 'dist' directory
    const distPath = path.join(projectRoot, 'dist')

    app.use(express.static(distPath))

    // Fallback to index.html for SPA routing
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'))
    })

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })

program.parse(process.argv)
