import { describe, expect, it } from 'vitest'
import { AuditLocker } from '../src/index.js'

// Method-name snapshot gate. The generated client's tag-grouping +
// name-resolution has shifted across generator versions; the clean names
// below are pinned in the OpenAPI spec via `x-speakeasy-name-override`. If a
// regen changes this surface the fix is the spec override — never an
// operationId rename (public forever) and never editing this snapshot to
// match drift.
describe('@auditlocker/sdk public method surface', () => {
  it('exposes exactly the four events methods under their canonical names', () => {
    const client = new AuditLocker({ apiKey: 'test' })
    const proto = Object.getPrototypeOf(client.events)
    const methods = Object.getOwnPropertyNames(proto)
      .filter((name) => name !== 'constructor' && typeof proto[name] === 'function')
      .sort()

    expect(methods).toEqual(['get', 'ingest', 'ingestBatch', 'list'])
  })
})
