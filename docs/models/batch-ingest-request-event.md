# BatchIngestRequestEvent

## Example Usage

```typescript
import { BatchIngestRequestEvent } from "@auditlocker/sdk/models";

let value: BatchIngestRequestEvent = {
  organizationId: "<id>",
  actor: {
    id: "<id>",
    type: "<value>",
  },
  action: "<value>",
  targets: [],
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `organizationId`                                                                              | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `actor`                                                                                       | [models.BatchIngestRequestActor](../models/batch-ingest-request-actor.md)                     | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `action`                                                                                      | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `targets`                                                                                     | [models.BatchIngestRequestTarget](../models/batch-ingest-request-target.md)[]                 | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `source`                                                                                      | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `metadata`                                                                                    | Record<string, *any*>                                                                         | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `timestamp`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |