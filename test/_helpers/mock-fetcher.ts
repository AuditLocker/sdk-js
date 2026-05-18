// Zero-dependency wire harness. The facade forwards `fetcher` to the generated
// HTTPClient, which invokes it with the final `Request` after the facade has
// filled the `source` default and minted/forwarded the idempotency key — so a
// recorded request is the exact wire image, and the returned Response drives
// the DlpHook's afterSuccess. No msw / undici / jsdom needed.

export interface RecordedRequest {
  method: string
  url: string
  headers: Headers
  body: unknown
}

export function jsonResponse(
  status: number,
  body: unknown,
  contentType = 'application/json',
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': contentType },
  })
}

// A schema-valid 201 single-ingest wire body (snake_case per
// IngestResponse$inboundSchema). `dlpRedactedFields` overrides the redaction
// array; default null = no redaction.
export function validIngest201(
  dlpRedactedFields: string[] | null = null,
  id = 'evt_test',
): Record<string, unknown> {
  return {
    id,
    received_at: '2026-05-17T00:00:00.000Z',
    timestamp_anomaly: null,
    dlp_redacted_fields: dlpRedactedFields,
  }
}

export function createMockFetcher(
  responder: (call: number, req: RecordedRequest) => Response | Promise<Response>,
): { fetcher: typeof fetch; calls: RecordedRequest[] } {
  const calls: RecordedRequest[] = []
  const fetcher = (async (input: Request | string | URL, init?: RequestInit): Promise<Response> => {
    const req = input instanceof Request ? input : new Request(input, init)
    const raw = await req.clone().text()
    let body: unknown
    try {
      body = raw ? JSON.parse(raw) : undefined
    } catch {
      body = raw
    }
    calls.push({
      method: req.method,
      url: req.url,
      headers: new Headers(req.headers),
      body,
    })
    return responder(calls.length - 1, calls[calls.length - 1]!)
  }) as unknown as typeof fetch
  return { fetcher, calls }
}
