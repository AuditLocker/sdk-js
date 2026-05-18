# IngestEventBatchResponse

## Example Usage

```typescript
import { IngestEventBatchResponse } from "@auditlocker/sdk/models/operations";

let value: IngestEventBatchResponse = {
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key1": [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    "key2": [],
  },
  result: {
    accepted: 47139,
    rejected: 448306,
    results: [
      {
        status: "rejected",
        index: 232968,
        error: {
          type: "https://api.auditlocker.co/errors/validation_error",
          title: "Validation Error",
          status: 400,
          detail: "actor.id must not be an email address",
          instance: "urn:uuid:01912f77-1234-7890-abcd-ef0123456789",
        },
      },
    ],
  },
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `headers`                                                           | Record<string, *string*[]>                                          | :heavy_check_mark:                                                  | N/A                                                                 |
| `result`                                                            | [models.BatchIngestResponse](../../models/batch-ingest-response.md) | :heavy_check_mark:                                                  | N/A                                                                 |