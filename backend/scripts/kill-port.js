/**
 * kill-port.js
 * Finds and kills any process holding port 5000 (or process.env.PORT).
 * Works on Windows using netstat + taskkill.
 * Used by: npm run kill-port  |  npm run dev:safe
 */

import { execSync } from 'child_process'

const PORT = process.env.PORT || 5000

console.log(`[kill-port] Checking for processes on port ${PORT}...`)

try {
  // netstat output format: Proto  Local Address  Foreign Address  State  PID
  const output = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' })

  // Collect unique PIDs that are actually LISTENING on the port
  const pids = new Set()
  for (const line of output.split('\n')) {
    // Match lines where the local address ends with :<PORT>
    const match = line.match(new RegExp(`:${PORT}\\s.*\\s+(\\d+)$`))
    if (match && line.includes('LISTENING')) {
      pids.add(match[1])
    }
  }

  if (pids.size === 0) {
    console.log(`[kill-port] ✅ Port ${PORT} is free — nothing to kill.`)
    process.exit(0)
  }

  for (const pid of pids) {
    // Skip PID 0 (system)
    if (pid === '0') continue
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' })
      console.log(`[kill-port] ✅ Killed PID ${pid} (was holding port ${PORT})`)
    } catch {
      console.warn(`[kill-port] ⚠️  Could not kill PID ${pid} (may already be gone)`)
    }
  }

  // Small delay so the OS releases the port before nodemon starts
  await new Promise((r) => setTimeout(r, 500))

} catch {
  // findstr exits with code 1 when nothing matches — that means port is free
  console.log(`[kill-port] ✅ Port ${PORT} is free — nothing to kill.`)
}
