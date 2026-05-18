// Cloudflare Workers import smoke. A minimal Worker that imports the built
// ESM entry and constructs the client. Run under local workerd (no account)
// via test/worker-smoke-runner.mjs. `nodejs_compat` is intentionally OFF —
// a stray `node:`-prefixed import or Node-only API would fail the bundle or
// the construct, which is exactly the signal we want for the Workers claim.
import { AuditLocker } from '../dist/esm/index.js'

export default {
  async fetch() {
    try {
      const client = new AuditLocker({ apiKey: 'smoke' })
      const methods = ['get', 'ingest', 'ingestBatch', 'list']
      for (const name of methods) {
        if (typeof client.events[name] !== 'function') {
          return new Response(`FAIL: client.events.${name} is not a function`, { status: 500 })
        }
      }
      return new Response(`worker-smoke OK: ${methods.join(', ')}`)
    } catch (err) {
      return new Response(`FAIL: ${err?.stack ?? err?.message ?? String(err)}`, { status: 500 })
    }
  },
}
