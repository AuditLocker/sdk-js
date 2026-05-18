# IngestEventResponse

## Example Usage

```typescript
import { IngestEventResponse } from "@auditlocker/sdk/models/operations";

let value: IngestEventResponse = {
  headers: {
    "key": [],
  },
  result: {
    id: "<id>",
    receivedAt: new Date("2025-09-05T22:56:19.281Z"),
    timestampAnomaly: "future_skew_exceeded",
    dlpRedactedFields: [
      "<value 1>",
      "<value 2>",
    ],
  },
};
```

## Fields

| Field                                                    | Type                                                     | Required                                                 | Description                                              |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `headers`                                                | Record<string, *string*[]>                               | :heavy_check_mark:                                       | N/A                                                      |
| `result`                                                 | [models.IngestResponse](../../models/ingest-response.md) | :heavy_check_mark:                                       | N/A                                                      |