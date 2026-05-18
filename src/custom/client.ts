import { SDKHooks } from '../hooks/hooks.js'
import type { SDKOptions } from '../lib/config.js'
import { HTTPClient } from '../lib/http.js'
import type { AuditEventInput } from '../models/audit-event-input.js'
import type { AuditEventOutput } from '../models/audit-event-output.js'
import type { BatchIngestRequestEvent } from '../models/batch-ingest-request.js'
import type { BatchIngestResponse } from '../models/batch-ingest-response.js'
import type { IngestResponse } from '../models/ingest-response.js'
import type { ListEventsRequest } from '../models/operations/list-events.js'
import { AuditLocker as GeneratedAuditLocker } from '../sdk/sdk.js'
import { DlpHook, type DlpRedactionEvent } from './hooks/dlp.js'

// SDK-mint prefix. The `al-sdk-` namespace is reserved for keys auto-minted by
// any AuditLocker SDK; `-js-` identifies this binding. Customer-supplied keys
// never use this prefix, so API logs can distinguish the two.
//
// Minting lives here (not a request hook) deliberately: the generated client
// re-invokes request hooks on every retry attempt, so a hook minting
// `crypto.randomUUID()` would emit a *fresh* key per retry and defeat
// server-side dedup on the exact 429/5xx path idempotency exists to protect.
// A key passed as the typed `idempotencyKey` request argument is re-serialised
// from the same fixed value on every retry — verified identical across a
// 429 → 201 retry (test/hooks/idempotency.test.ts).
const SDK_KEY_PREFIX = 'al-sdk-js-'

function mintKey(): string {
  return `${SDK_KEY_PREFIX}${globalThis.crypto.randomUUID()}`
}

export type EmitInput = AuditEventInput
export type BatchEmitInput = BatchIngestRequestEvent

// Per-call option bag. `idempotencyKey` is forwarded as the generated
// method's typed header argument; the facade auto-mints one (see `mintKey`)
// when the caller supplies none.
export interface EmitOptions {
  idempotencyKey?: string
  signal?: AbortSignal
}

export interface AuditLockerOptions {
  apiKey: string
  /** Overrides the default production URL — relay-proxy or self-hosted edge. */
  serverURL?: string
  /** Fallback `source` when an event omits it. Defaults to `'api'`. */
  defaultSource?: string
  /**
   * Out-of-band notification when the API redacted fields under DLP. Fired
   * fire-and-forget per redacted event; a throwing/rejecting callback is
   * logged once and swallowed. The redaction info is also on the return
   * value (`dlpRedactedFields`) regardless of whether this is set.
   */
  onDlpRedaction?: (e: DlpRedactionEvent) => unknown
  fetcher?: typeof fetch
}

const DEFAULT_SOURCE = 'api'

export class AuditLocker {
  readonly #sdk: GeneratedAuditLocker
  readonly #defaultSource: string

  constructor(opts: AuditLockerOptions) {
    const hooks = new SDKHooks()
    hooks.registerAfterSuccessHook(new DlpHook(opts.onDlpRedaction))

    // `hooks` is honoured by the generated ClientSDK constructor when it is an
    // SDKHooks instance (src/lib/sdks.ts). It is not on the public SDKOptions
    // type, so the carrying object is typed locally and passed by value —
    // assignable to the constructor's SDKOptions parameter as a subtype.
    // Built with conditional spreads — tsconfig has exactOptionalPropertyTypes,
    // so optional SDKOptions fields must be omitted, not set to `undefined`.
    const sdkOptions: SDKOptions & { hooks: SDKHooks } = {
      apiKey: opts.apiKey,
      hooks,
      ...(opts.serverURL !== undefined ? { serverURL: opts.serverURL } : {}),
      ...(opts.fetcher
        ? { httpClient: new HTTPClient({ fetcher: opts.fetcher }) }
        : {}),
    }
    this.#sdk = new GeneratedAuditLocker(sdkOptions)
    this.#defaultSource = opts.defaultSource ?? DEFAULT_SOURCE
  }

  // RequestOptions.signal is `AbortSignal | null` (no `| undefined` under
  // exactOptionalPropertyTypes) — omit the key entirely when not supplied.
  #reqOpts(opts?: EmitOptions): { signal: AbortSignal } | undefined {
    return opts?.signal ? { signal: opts.signal } : undefined
  }

  async emit(event: EmitInput, opts?: EmitOptions): Promise<IngestResponse> {
    const body = { ...event, source: event.source ?? this.#defaultSource }
    const { result } = await this.#sdk.events.ingest(
      { idempotencyKey: opts?.idempotencyKey ?? mintKey(), body },
      this.#reqOpts(opts),
    )
    return result
  }

  async emitBatch(
    events: BatchEmitInput[],
    opts?: EmitOptions,
  ): Promise<BatchIngestResponse> {
    const filled = events.map((event) => ({
      ...event,
      source: event.source ?? this.#defaultSource,
    }))
    // Per-batch key (the whole `events` array is the request body): replay
    // with the same key replays the batch atomically. Partial-failure retry
    // of only the rejected items needs a fresh batch + key by the caller.
    const { result } = await this.#sdk.events.ingestBatch(
      {
        idempotencyKey: opts?.idempotencyKey ?? mintKey(),
        body: { events: filled },
      },
      this.#reqOpts(opts),
    )
    return result
  }

  list(params?: ListEventsRequest) {
    return this.#sdk.events.list(params)
  }

  async get(id: string): Promise<AuditEventOutput> {
    const { result } = await this.#sdk.events.get({ id })
    return result
  }
}
