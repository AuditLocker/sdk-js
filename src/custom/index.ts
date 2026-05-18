// Hand-written package entry (regen-safe — not tracked in .speakeasy/gen.lock).
// The generated client lives at ../sdk/sdk.ts and is intentionally NOT the
// package's public surface: the facade is the single entry point so the
// `source` default and the idempotency / DLP hooks cannot be bypassed.

export { AuditLocker } from './client.js'
export type {
  AuditLockerOptions,
  BatchEmitInput,
  EmitInput,
  EmitOptions,
} from './client.js'
export type { DlpRedactionEvent } from './hooks/dlp.js'

// Typed error classes (one per status, all extending AuditLockerError) plus
// the SDKValidationError / network-error siblings — the three-bucket catch
// surface.
export * from '../models/errors/index.js'

export type { AuditEventInput } from '../models/audit-event-input.js'
export type { AuditEventOutput } from '../models/audit-event-output.js'
export type { BatchIngestResponse } from '../models/batch-ingest-response.js'
export type { IngestResponse } from '../models/ingest-response.js'
