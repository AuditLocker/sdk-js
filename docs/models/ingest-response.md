# IngestResponse

Event accepted and persisted.

## Example Usage

```typescript
import { IngestResponse } from "@auditlocker/sdk/models";

let value: IngestResponse = {
  id: "<id>",
  receivedAt: new Date("2025-03-05T17:01:19.448Z"),
  timestampAnomaly: "past_window_exceeded",
  dlpRedactedFields: [],
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                                                                                          | *string*                                                                                      | :heavy_check_mark:                                                                            | Unique identifier for the created event.                                                      |
| `receivedAt`                                                                                  | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | ISO 8601 timestamp when the server accepted the event.                                        |
| `timestampAnomaly`                                                                            | *models.IngestResponseTimestampAnomalyUnion*                                                  | :heavy_check_mark:                                                                            | Non-null when the supplied timestamp fell outside the accepted window around received_at.     |
| `dlpRedactedFields`                                                                           | *string*[]                                                                                    | :heavy_check_mark:                                                                            | Field paths that were redacted by data-loss-prevention scanning, if any.                      |