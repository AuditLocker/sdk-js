import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

// Dual-emit load-bearing test. The dual emit uses plain `.js` files in
// dist/esm and dist/commonjs with inner
// package.json `type` overrides — there is no `.cjs` suffix to match on, so
// assert the *resolved path* genuinely routes through /commonjs/. Without
// this, a CJS consumer could silently be served the ESM entry and the test
// would still pass. Requires `pnpm build` first (CI runs build before test).
describe('CJS consumer entry', () => {
  it('resolves @auditlocker/sdk through the commonjs build and require()s it', () => {
    const require = createRequire(import.meta.url)
    const resolved = require.resolve('@auditlocker/sdk')
    expect(resolved).toContain('/commonjs/')

    const mod = require('@auditlocker/sdk') as { AuditLocker: unknown }
    expect(typeof mod.AuditLocker).toBe('function')
  })
})
