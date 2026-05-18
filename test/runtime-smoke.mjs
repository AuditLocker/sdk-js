// Cross-runtime import smoke. Runs under Node, Deno, and Bun against the
// built ESM entry. No network — this proves the bundle imports and
// constructs on each runtime (catches `node:`-prefixed imports, missing
// WebCrypto, etc.).
import { AuditLocker } from '../dist/esm/index.js'

const client = new AuditLocker({ apiKey: 'smoke' })
const methods = ['get', 'ingest', 'ingestBatch', 'list']
for (const name of methods) {
  if (typeof client.events[name] !== 'function') {
    console.error(`FAIL: client.events.${name} is not a function`)
    process.exit(1)
  }
}
console.log('runtime-smoke OK:', methods.join(', '))
