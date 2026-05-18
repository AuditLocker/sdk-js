# GetEventResponse

## Example Usage

```typescript
import { GetEventResponse } from "@auditlocker/sdk/models/operations";

let value: GetEventResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
  result: {
    id: "<id>",
    environmentId: "<id>",
    organizationId: "<id>",
    receivedAt: new Date("2024-08-10T15:10:40.512Z"),
    timestamp: new Date("2024-09-13T14:41:25.664Z"),
    timestampAnomaly: "future_skew_exceeded",
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
    },
  },
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `headers`                                                     | Record<string, *string*[]>                                    | :heavy_check_mark:                                            | N/A                                                           |
| `result`                                                      | [models.AuditEventOutput](../../models/audit-event-output.md) | :heavy_check_mark:                                            | N/A                                                           |