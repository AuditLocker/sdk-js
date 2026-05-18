# AuditEventOutput

A single audit event with full forensic context.

## Example Usage

```typescript
import { AuditEventOutput } from "@auditlocker/sdk/models";

let value: AuditEventOutput = {
  id: "<id>",
  environmentId: "<id>",
  organizationId: "<id>",
  receivedAt: new Date("2026-11-15T08:57:14.034Z"),
  timestamp: new Date("2025-06-19T16:24:02.528Z"),
  timestampAnomaly: "past_window_exceeded",
  actor: {
    id: "<id>",
    type: "<value>",
    name: null,
  },
  action: "<value>",
  targets: [
    {
      type: "<value>",
      id: "<id>",
      name: "<value>",
    },
  ],
  source: "<value>",
  metadata: {
    "key": "<value>",
    "key1": "<value>",
  },
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                                                                                          | *string*                                                                                      | :heavy_check_mark:                                                                            | Unique identifier for the event.                                                              |
| `environmentId`                                                                               | *string*                                                                                      | :heavy_check_mark:                                                                            | Identifier of the environment this event belongs to.                                          |
| `organizationId`                                                                              | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `receivedAt`                                                                                  | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `timestamp`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `timestampAnomaly`                                                                            | *models.AuditEventOutputTimestampAnomalyUnion*                                                | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `actor`                                                                                       | [models.AuditEventOutputActor](../models/audit-event-output-actor.md)                         | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `action`                                                                                      | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `targets`                                                                                     | [models.AuditEventOutputTarget](../models/audit-event-output-target.md)[]                     | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `source`                                                                                      | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `metadata`                                                                                    | Record<string, *any*>                                                                         | :heavy_check_mark:                                                                            | N/A                                                                                           |