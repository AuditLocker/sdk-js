# BatchIngestResponse

Multi-status result for batch ingest — inspect `results[].status` to distinguish accepted from rejected events.

## Example Usage

```typescript
import { BatchIngestResponse } from "@auditlocker/sdk/models";

let value: BatchIngestResponse = {
  accepted: 797602,
  rejected: 317750,
  results: [
    {
      status: "accepted",
      index: 333107,
      id: "<id>",
      receivedAt: new Date("2026-07-09T23:37:56.866Z"),
      dlpRedactedFields: [
        "<value 1>",
        "<value 2>",
        "<value 3>",
      ],
    },
  ],
};
```

## Fields

| Field                                                  | Type                                                   | Required                                               | Description                                            |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| `accepted`                                             | *number*                                               | :heavy_check_mark:                                     | Number of events successfully ingested                 |
| `rejected`                                             | *number*                                               | :heavy_check_mark:                                     | Number of events that failed validation                |
| `results`                                              | *models.Result*[]                                      | :heavy_check_mark:                                     | Per-event results in the same order as the input array |