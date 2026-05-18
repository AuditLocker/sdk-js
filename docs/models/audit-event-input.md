# AuditEventInput

## Example Usage

```typescript
import { AuditEventInput } from "@auditlocker/sdk/models";

let value: AuditEventInput = {
  organizationId: "<id>",
  actor: {
    id: "<id>",
    type: "<value>",
  },
  action: "<value>",
  targets: [
    {
      type: "<value>",
      id: "<id>",
    },
  ],
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `organizationId`                                                                              | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `actor`                                                                                       | [models.AuditEventInputActor](../models/audit-event-input-actor.md)                           | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `action`                                                                                      | *string*                                                                                      | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `targets`                                                                                     | [models.AuditEventInputTarget](../models/audit-event-input-target.md)[]                       | :heavy_check_mark:                                                                            | N/A                                                                                           |
| `source`                                                                                      | *string*                                                                                      | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `metadata`                                                                                    | Record<string, *any*>                                                                         | :heavy_minus_sign:                                                                            | N/A                                                                                           |
| `timestamp`                                                                                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_minus_sign:                                                                            | N/A                                                                                           |