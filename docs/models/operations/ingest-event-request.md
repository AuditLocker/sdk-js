# IngestEventRequest

## Example Usage

```typescript
import { IngestEventRequest } from "@auditlocker/sdk/models/operations";

let value: IngestEventRequest = {
  idempotencyKey: "evt_abc123_1714000000",
  body: {
    organizationId: "<id>",
    actor: {
      id: "<id>",
      type: "<value>",
    },
    action: "<value>",
    targets: [],
  },
};
```

## Fields

| Field                                                                                                                                                                                                   | Type                                                                                                                                                                                                    | Required                                                                                                                                                                                                | Description                                                                                                                                                                                             | Example                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idempotencyKey`                                                                                                                                                                                        | *string*                                                                                                                                                                                                | :heavy_minus_sign:                                                                                                                                                                                      | Client-generated unique key for idempotent requests. Duplicate requests with the same key and payload within 24 hours return the cached response. Same key with different payload returns 409 Conflict. | evt_abc123_1714000000                                                                                                                                                                                   |
| `body`                                                                                                                                                                                                  | [models.AuditEventInput](../../models/audit-event-input.md)                                                                                                                                             | :heavy_check_mark:                                                                                                                                                                                      | N/A                                                                                                                                                                                                     |                                                                                                                                                                                                         |