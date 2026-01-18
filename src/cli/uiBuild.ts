import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const latestMtimeInDir = (dir: string): number => {
  if (!fs.existsSync(dir)) return 0
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let latest = 0
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      latest = Math.max(latest, latestMtimeInDir(fullPath))
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath)
      latest = Math.max(latest, stat.mtimeMs)
    }
  }
  return latest
}

export const shouldRebuildUi = (rootDir: string) => {
  const distIndex = path.join(rootDir, 'dist', 'index.html')
  if (!fs.existsSync(distIndex)) return true
  const distMtime = fs.statSync(distIndex).mtimeMs
  const srcDir = path.join(rootDir, 'src')
  const latestSrcMtime = latestMtimeInDir(srcDir)
  return latestSrcMtime > distMtime
}

const runCommand = (cmd: string, args: string[], cwd: string) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${cmd} exited with code ${code}`))
      }
    })
  })

export const ensureUiBuild = async (rootDir: string, logger: Console = console) => {
  if (!shouldRebuildUi(rootDir)) return false
  logger.log('UI build missing or stale. Running npm run build...')
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  await runCommand(npmCmd, ['run', 'build'], rootDir)
  return true
}
