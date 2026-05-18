# ListEventsResponse

## Example Usage

```typescript
import { ListEventsResponse } from "@auditlocker/sdk/models/operations";

let value: ListEventsResponse = {
  headers: {},
  result: {
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
  },
};
```

## Fields

| Field                                                  | Type                                                   | Required                                               | Description                                            |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| `headers`                                              | Record<string, *string*[]>                             | :heavy_check_mark:                                     | N/A                                                    |
| `result`                                               | [models.QueryResponse](../../models/query-response.md) | :heavy_check_mark:                                     | N/A                                                    |