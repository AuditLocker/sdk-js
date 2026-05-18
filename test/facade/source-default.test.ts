import { describe, expect, it } from 'vitest'
import { AuditLocker } from '../../src/custom/index.js'
import { createMockFetcher, jsonResponse, validIngest201 } from '../_helpers/mock-fetcher.js'

const BASE = {
  organizationId: 'org_1',
  actor: { id: 'u1', type: 'user' },
  action: 'user.role.changed',
  targets: [{ type: 'user', id: 'u2' }],
}

function batch207(): Record<string, unknown> {
  return {
    accepted: 2,
    rejected: 0,
    results: [
      {
        status: 'accepted',
        index: 0,
        id: 'e0',
        received_at: '2026-05-17T00:00:00.000Z',
        dlp_redacted_fields: null,
      },
      {
        status: 'accepted',
        index: 1,
        id: 'e1',
        received_at: '2026-05-17T00:00:00.000Z',
        dlp_redacted_fields: null,
      },
    ],
  }
}

describe('facade source default', () => {
  it("defaults source to 'api' when omitted", async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(201, validIngest201()))
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emit({ ...BASE })

    expect((calls[0]!.body as { source?: string }).source).toBe('api')
  })

  it('passes an explicit source through unchanged', async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(201, validIngest201()))
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emit({ ...BASE, source: 'background_job' })

    expect((calls[0]!.body as { source?: string }).source).toBe('background_job')
  })

  it('honours a constructor-level defaultSource override', async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(201, validIngest201()))
    const audit = new AuditLocker({ apiKey: 't', fetcher, defaultSource: 'worker' })

    await audit.emit({ ...BASE })

    expect((calls[0]!.body as { source?: string }).source).toBe('worker')
  })

  it('fills the default per-element in a batch, preserving explicit overrides', async () => {
    const { fetcher, calls } = createMockFetcher(() => jsonResponse(207, batch207()))
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    await audit.emitBatch([{ ...BASE }, { ...BASE, source: 'cron' }])

    const sent = calls[0]!.body as { events: Array<{ source?: string }> }
    expect(sent.events[0]!.source).toBe('api')
    expect(sent.events[1]!.source).toBe('cron')
  })
})
