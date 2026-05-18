# QueryResponseEvent

A single audit event with full forensic context.

## Example Usage

```typescript
import { QueryResponseEvent } from "@auditlocker/sdk/models";

let value: QueryResponseEvent = {
  id: "<id>",
  environmentId: "<id>",
  organizationId: "<id>",
  receivedAt: new Date("2025-06-24T08:45:59.698Z"),
  timestamp: new Date("2024-08-14T17:58:42.906Z"),
  timestampAnomaly: "past_window_exceeded",
  actor: {
    id: "<id>",
    type: "<value>",
    name: "<value>",
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
| `timestampAnomaly`                                                                            | *models.QueryResponseTimestampAnomalyUnion*                                                   | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `actor`                                                                                       | [models.QueryResponseActor](../models/query-response-actor.md)                                | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `action`                                                                                      | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `targets`                                                                                     | [models.QueryResponseTarget](../models/query-response-target.md)[]                            | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `source`                                                                                      | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `metadata`                                                                                    | Record<string, *any*>                                                                         | :heavy_check_mark:                                                                            | N/A                                                                                           |