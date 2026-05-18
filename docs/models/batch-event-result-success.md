# BatchEventResultSuccess

## Example Usage

```typescript
import { BatchEventResultSuccess } from "@auditlocker/sdk/models";

let value: BatchEventResultSuccess = {
  status: "accepted",
  index: 281970,
  id: "<id>",
  receivedAt: new Date("2024-12-21T03:01:51.382Z"),
  dlpRedactedFields: [
    "<value 1>",
  ],
};
```

## Fields

| Field                                                                                                                      | Type                                                                                                                       | Required                                                                                                                   | Description                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `status`                                                                                                                   | *"accepted"*                                                                                                               | :heavy_check_mark:                                                                                                         | Discriminator literal — narrows the union to the success variant.                                                          |
| `index`                                                                                                                    | *number*                                                                                                                   | :heavy_check_mark:                                                                                                         | N/A                                                                                                                        |
| `id`                                                                                                                       | *string*                                                                                                                   | :heavy_check_mark:                                                                                                         | Unique identifier for the created event.                                                                                   |
| `receivedAt`                                                                                                               | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                              | :heavy_check_mark:                                                                                                         | N/A                                                                                                                        |
| `dlpRedactedFields`                                                                                                        | *string*[]                                                                                                                 | :heavy_check_mark:                                                                                                         | Field paths that were redacted by data-loss-prevention scanning, if any. Per-event — present on every accepted batch item. |