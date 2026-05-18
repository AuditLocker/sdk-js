# BatchEventResultError

## Example Usage

```typescript
import { BatchEventResultError } from "@auditlocker/sdk/models";

let value: BatchEventResultError = {
  status: "rejected",
  index: 307473,
  error: {
    type: "https://api.auditlocker.co/errors/validation_error",
    title: "Validation Error",
    status: 400,
    detail: "actor.id must not be an email address",
    instance: "urn:uuid:01912f77-1234-7890-abcd-ef0123456789",
  },
};
```

## Fields

| Field                                                                                                                                                                    | Type                                                                                                                                                                     | Required                                                                                                                                                                 | Description                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                                                                                                                                                                 | *"rejected"*                                                                                                                                                             | :heavy_check_mark:                                                                                                                                                       | Discriminator literal — narrows the union to the error variant.                                                                                                          |
| `index`                                                                                                                                                                  | *number*                                                                                                                                                                 | :heavy_check_mark:                                                                                                                                                       | N/A                                                                                                                                                                      |
| `error`                                                                                                                                                                  | [models.ProblemDetails](../models/problem-details.md)                                                                                                                    | :heavy_check_mark:                                                                                                                                                       | RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. |