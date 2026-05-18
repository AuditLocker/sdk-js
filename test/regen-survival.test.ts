import { describe, expect, it } from 'vitest'
import pkg from '../package.json' with { type: 'json' }

// Regen-survival gate. The generator rewrites package.json on every regen;
// these supply-chain + resolution invariants must never silently regress on
// a routine spec-driven regen. Asserted on the committed package.json
// (value-based, not byte-based — the generator does not guarantee object
// key-insertion order across runs, so a byte diff would false-positive on a
// harmless key reorder).
describe('package.json regen-survival invariants', () => {
  it('keeps npm provenance enabled', () => {
    expect(pkg.publishConfig?.provenance).toBe(true)
  })

  it('keeps the engines.node floor at >=22', () => {
    expect(pkg.engines?.node).toBe('>=22')
  })

  it('stays pinned at the pre-release version', () => {
    expect(pkg.version).toBe('0.0.0')
  })

  it('orders the `types` condition before `default` under every exports entry', () => {
    const root = pkg.exports['.'] as Record<string, Record<string, string>>
    for (const condition of ['import', 'require'] as const) {
      const keys = Object.keys(root[condition])
      const typesAt = keys.indexOf('types')
      const defaultAt = keys.indexOf('default')
      expect(typesAt, `${condition}: types present`).toBeGreaterThanOrEqual(0)
      expect(typesAt, `${condition}: types before default`).toBeLessThan(defaultAt)
    }
  })

  it('keeps the package entry repointed at the hand-written facade', () => {
    // The public surface is src/custom/index.ts (the facade), not the
    // regen-owned src/index.ts (the raw generated client). A regen reverts
    // this entry; scripts/repoint-entry.mjs re-points it afterwards, and this
    // assertion fails loudly if a regen landed without that step.
    const tshy = pkg.tshy as { exports: Record<string, string> }
    expect(tshy.exports['.']).toBe('./src/custom/index.ts')

    const root = pkg.exports['.'] as Record<string, Record<string, string>>
    expect(root.import?.default).toBe('./dist/esm/custom/index.js')
    expect(root.require?.default).toBe('./dist/commonjs/custom/index.js')
    expect(pkg.main).toBe('./dist/commonjs/custom/index.js')
    expect(pkg.module).toBe('./dist/esm/custom/index.js')
  })
})
