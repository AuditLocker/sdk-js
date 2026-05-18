# BatchIngestRequest

## Example Usage

```typescript
import { BatchIngestRequest } from "@auditlocker/sdk/models";

let value: BatchIngestRequest = {
  events: [
    {
      organizationId: "<id>",
      actor: {
        id: "<id>",
        type: "<value>",
      },
      action: "<value>",
      targets: [],
    },
  ],
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `events`                                                                    | [models.BatchIngestRequestEvent](../models/batch-ingest-request-event.md)[] | :heavy_check_mark:                                                          | N/A                                                                         |