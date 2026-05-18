// Runs test/worker-smoke.js under local workerd via wrangler's programmatic
// dev API — no Cloudflare account, no network. Proves @auditlocker/sdk
// imports and constructs in the Cloudflare Workers runtime (the README
// "edge runtimes" claim). nodejs_compat is intentionally NOT set.
import { unstable_dev } from 'wrangler'

const worker = await unstable_dev('test/worker-smoke.js', {
  experimental: { disableExperimentalWarning: true },
  compatibilityDate: '2026-05-01',
})

try {
  const res = await worker.fetch()
  const body = await res.text()
  if (res.status !== 200 || !body.startsWith('worker-smoke OK')) {
    console.error(`FAIL: status=${res.status} body=${body}`)
    process.exit(1)
  }
  console.log(`${body} (workerd)`)
} finally {
  await worker.stop()
}
