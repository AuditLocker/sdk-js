import { describe, expect, it, vi } from 'vitest'
import { AuditLocker, type DlpRedactionEvent } from '../../src/custom/index.js'
import { createMockFetcher, jsonResponse, validIngest201 } from '../_helpers/mock-fetcher.js'

const EVENT = {
  organizationId: 'org_1',
  actor: { id: 'u1', type: 'user' },
  action: 'user.role.changed',
  targets: [{ type: 'user', id: 'u2' }],
}

describe('DlpHook (redaction surfacing)', () => {
  it('fires onDlpRedaction for a single ingest with redacted fields', async () => {
    const seen: DlpRedactionEvent[] = []
    const { fetcher } = createMockFetcher(() =>
      jsonResponse(201, validIngest201(['metadata.ssn'], 'evt_9')),
    )
    const audit = new AuditLocker({
      apiKey: 't',
      fetcher,
      onDlpRedaction: (e) => seen.push(e),
    })

    await audit.emit(EVENT)

    await vi.waitFor(() => expect(seen).toHaveLength(1))
    expect(seen[0]).toEqual({ eventId: 'evt_9', redactedFields: ['metadata.ssn'] })
  })

  it('does NOT fire when dlp_redacted_fields is empty/null', async () => {
    const cb = vi.fn()
    const { fetcher } = createMockFetcher(() => jsonResponse(201, validIngest201(null)))
    const audit = new AuditLocker({ apiKey: 't', fetcher, onDlpRedaction: cb })

    await audit.emit(EVENT)
    await new Promise((r) => setTimeout(r, 20))

    expect(cb).not.toHaveBeenCalled()
  })

  it('fires once per accepted-with-redactions entry in a batch', async () => {
    const seen: DlpRedactionEvent[] = []
    const body = {
      accepted: 2,
      rejected: 1,
      results: [
        {
          status: 'accepted',
          index: 0,
          id: 'b0',
          received_at: '2026-05-17T00:00:00.000Z',
          dlp_redacted_fields: ['metadata.card'],
        },
        {
          status: 'rejected',
          index: 1,
          error: { type: 'about:blank', title: 'Bad Request', status: 400 },
        },
        {
          status: 'accepted',
          index: 2,
          id: 'b2',
          received_at: '2026-05-17T00:00:00.000Z',
          dlp_redacted_fields: null,
        },
      ],
    }
    const { fetcher } = createMockFetcher(() => jsonResponse(207, body))
    const audit = new AuditLocker({
      apiKey: 't',
      fetcher,
      onDlpRedaction: (e) => seen.push(e),
    })

    await audit.emitBatch([EVENT, EVENT, EVENT])

    await vi.waitFor(() => expect(seen).toHaveLength(1))
    expect(seen[0]).toEqual({ eventId: 'b0', redactedFields: ['metadata.card'] })
  })

  it('swallows a throwing callback, logs once, and still resolves emit', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { fetcher } = createMockFetcher(() =>
      jsonResponse(201, validIngest201(['metadata.ssn'], 'evt_t')),
    )
    const audit = new AuditLocker({
      apiKey: 't',
      fetcher,
      onDlpRedaction: () => {
        throw new Error('boom')
      },
    })

    const res = await audit.emit(EVENT)
    expect(res.id).toBe('evt_t')

    await vi.waitFor(() =>
      expect(warn).toHaveBeenCalledWith(
        '[auditlocker] onDlpRedaction callback threw',
        expect.any(Error),
      ),
    )
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('swallows a rejecting async callback and logs once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { fetcher } = createMockFetcher(() =>
      jsonResponse(201, validIngest201(['metadata.ssn'], 'evt_r2')),
    )
    const audit = new AuditLocker({
      apiKey: 't',
      fetcher,
      onDlpRedaction: () => Promise.reject(new Error('async boom')),
    })

    await audit.emit(EVENT)

    await vi.waitFor(() =>
      expect(warn).toHaveBeenCalledWith(
        '[auditlocker] onDlpRedaction callback threw',
        expect.any(Error),
      ),
    )
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('no callback registered → redaction info still on the return value', async () => {
    const { fetcher } = createMockFetcher(() =>
      jsonResponse(201, validIngest201(['metadata.ssn'], 'evt_r')),
    )
    const audit = new AuditLocker({ apiKey: 't', fetcher })

    const res = await audit.emit(EVENT)

    expect(res.id).toBe('evt_r')
    expect(res.dlpRedactedFields).toEqual(['metadata.ssn'])
  })
})
