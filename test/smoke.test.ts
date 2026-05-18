import { describe, expect, it } from 'vitest'
import {
  AuditLocker,
  AuditLockerError,
  RateLimitedError,
  ScopeMismatchError,
  ValidationError,
} from '../src/custom/index.js'

describe('@auditlocker/sdk', () => {
  it('exposes exactly the facade surface — no generated escape hatches', () => {
    const client = new AuditLocker({ apiKey: 'test' })
    const surface = Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(
      (name) => name !== 'constructor',
    )

    expect(surface.sort()).toEqual(['emit', 'emitBatch', 'get', 'list'])
    // The generated `events` namespace and a `raw` accessor would bypass the
    // facade's source default — the facade forbids both.
    expect('events' in client).toBe(false)
    expect('raw' in client).toBe(false)
  })

  it('exports the branded base error and per-status typed subclasses', () => {
    // Error contract: one class per status, all extending the branded base.
    // ScopeMismatchError is the v1 403.
    expect(ValidationError.prototype).toBeInstanceOf(AuditLockerError)
    expect(ScopeMismatchError.prototype).toBeInstanceOf(AuditLockerError)
    expect(RateLimitedError.prototype).toBeInstanceOf(AuditLockerError)
  })
})
