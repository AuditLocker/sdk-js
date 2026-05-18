# QueryResponse

Paginated list of audit events matching the supplied filters.

## Example Usage

```typescript
import { QueryResponse } from "@auditlocker/sdk/models";

let value: QueryResponse = {
  events: [
    {
      id: "<id>",
      environmentId: "<id>",
      organizationId: "<id>",
      receivedAt: new Date("2024-06-11T14:40:25.003Z"),
      timestamp: new Date("2025-05-18T04:18:42.278Z"),
      timestampAnomaly: "future_skew_exceeded",
      actor: {
        id: "<id>",
        type: "<value>",
        name: "<value>",
      },
      action: "<value>",
      targets: [],
      source: "<value>",
      metadata: null,
    },
  ],
  nextCursor: "<value>",
};
```

## Fields

| Field                                                            | Type                                                             | Required                                                         | Description                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `events`                                                         | [models.QueryResponseEvent](../models/query-response-event.md)[] | :heavy_check_mark:                                               | N/A                                                              |
| `nextCursor`                                                     | *string*                                                         | :heavy_check_mark:                                               | N/A                                                              |