import type { AfterSuccessContext, AfterSuccessHook } from '../../hooks/types.js'

export interface DlpRedactionEvent {
  eventId: string
  redactedFields: string[]
}

const INGEST_OPS: ReadonlySet<string> = new Set([
  'ingestEvent',
  'ingestEventBatch',
])

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0
}

// Parses the raw wire body (snake_case) — single ingest is a flat object,
// batch ingest carries a `results` array with one entry per input event.
function extractRedactions(operationID: string, body: unknown): DlpRedactionEvent[] {
  if (typeof body !== 'object' || body === null) return []

  if (operationID === 'ingestEvent') {
    const { id, dlp_redacted_fields: fields } = body as Record<string, unknown>
    if (typeof id === 'string' && isNonEmptyStringArray(fields)) {
      return [{ eventId: id, redactedFields: fields }]
    }
    return []
  }

  // ingestEventBatch
  const { results } = body as { results?: unknown }
  if (!Array.isArray(results)) return []
  const out: DlpRedactionEvent[] = []
  for (const entry of results) {
    if (typeof entry !== 'object' || entry === null) continue
    const { status, id, dlp_redacted_fields: fields } = entry as Record<string, unknown>
    if (status === 'accepted' && typeof id === 'string' && isNonEmptyStringArray(fields)) {
      out.push({ eventId: id, redactedFields: fields })
    }
  }
  return out
}

export class DlpHook implements AfterSuccessHook {
  constructor(private readonly onRedaction?: (e: DlpRedactionEvent) => unknown) {}

  afterSuccess(ctx: AfterSuccessContext, response: Response): Response {
    const callback = this.onRedaction
    if (!callback || !INGEST_OPS.has(ctx.operationID)) return response

    // Fire-and-forget: clone before the SDK consumes the body, schedule the
    // parse + callback off the synchronous return path so response delivery
    // to the SDK's own consumer is never blocked. A throwing or rejecting
    // callback is logged once and swallowed — a consumer that needs reliable
    // redaction logging owns its own queue (documented on AuditLockerOptions).
    const cloned = response.clone()
    void (async () => {
      let body: unknown
      try {
        body = await cloned.json()
      } catch (err) {
        console.warn('[auditlocker] onDlpRedaction could not parse response', err)
        return
      }
      for (const event of extractRedactions(ctx.operationID, body)) {
        try {
          await callback(event)
        } catch (err) {
          console.warn('[auditlocker] onDlpRedaction callback threw', err)
        }
      }
    })()

    return response
  }
}
