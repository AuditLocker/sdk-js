import { describe, expect, it } from 'vitest'
import { AuditLocker } from '../../src/custom/index.js'
import { createMockFetcher, jsonResponse, validIngest201 } from '../_helpers/mock-fetcher.js'

// Idempotency-key minting lives in the facade (NOT a request hook): the
// generated client re-invokes request hooks on every retry attempt, so a
// minting hook would emit a fresh key per retry and defeat server dedup on
// the 429/5xx path. A key passed as the typed `idempotencyKey` request
// argument is re-serialised from the same fixed value on every retry. These
// tests assert the resulting wire behaviour and survive regeneration.

const KEY_RE = /^al-sdk-js-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

const EVENT = {
  organizationId: 'org_1',
  actor: { id: 'u1', type: 'user' },
  action: 'user.role.changed',
  targets: [{ type: 'user', id: 'u2' }],
}

function ik(headers: Headers): string | null {
  return headers.get('idempotency-key')
}

describe('idempotency key (facade-minted, wire behaviour)', () => {
  it('auto-mints a distinct prefixed key per write when none supplied', async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(201, validIngest201()))
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emit(EVENT)
    await audit.emit(EVENT)

    const k1 = ik(calls[0]!.headers)
    const k2 = ik(calls[1]!.headers)
    expect(k1).toMatch(KEY_RE)
    expect(k2).toMatch(KEY_RE)
    expect(k1).not.toEqual(k2)
  })

  it('mints a single per-batch key on emitBatch', async () => {
    const { fetcher, calls } = createMockFetcher(() =>
      jsonResponse(207, {
        accepted: 1,
        rejected: 0,
        results: [
          {
            status: 'accepted',
            index: 0,
            id: 'e0',
            received_at: '2026-05-17T00:00:00.000Z',
            dlp_redacted_fields: null,
          },
        ],
      }),
    )
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emitBatch([EVENT, EVENT])

    expect(ik(calls[0]!.headers)).toMatch(KEY_RE)
  })

  it('passes a caller-supplied key through verbatim (no prefix)', async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(201, validIngest201()))
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emit(EVENT, { idempotencyKey: 'order-123-attempt' })

    expect(ik(calls[0]!.headers)).toBe('order-123-attempt')
  })

  it('does not attach Idempotency-Key on reads', async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(200, {}))
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.get('evt_1').catch(() => {})
    await (async () => {
      const pages = await audit.list({})
      for await (const _page of pages) break
    })().catch(() => {})

    expect(calls.length).toBeGreaterThanOrEqual(2)
    for (const call of calls) {
      expect(call.headers.has('idempotency-key')).toBe(false)
    }
  })

  it('replays the SAME auto-minted key across a retried request (429 → 201)', async () => {
    const { fetcher, calls } = createMockFetcher((n) =>
      n === 0
        ? jsonResponse(
            429,
            { type: 'about:blank', title: 'Too Many', status: 429 },
            'application/problem+json',
          )
        : jsonResponse(201, validIngest201()),
    )
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emit(EVENT)

    expect(calls.length).toBe(2)
    const first = ik(calls[0]!.headers)
    expect(first).toMatch(KEY_RE)
    expect(ik(calls[1]!.headers)).toBe(first)
  }, 15000)

  it('replays a caller-supplied key identically across a 429 → 201 retry', async () => {
    const { fetcher, calls } = createMockFetcher((n) =>
      n === 0
        ? jsonResponse(
            429,
            { type: 'about:blank', title: 'Too Many', status: 429 },
            'application/problem+json',
          )
        : jsonResponse(201, validIngest201()),
    )
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emit(EVENT, { idempotencyKey: 'fixed-key-123' })

    expect(calls.length).toBe(2)
    expect(ik(calls[0]!.headers)).toBe('fixed-key-123')
    expect(ik(calls[1]!.headers)).toBe('fixed-key-123')
  }, 15000)
})
