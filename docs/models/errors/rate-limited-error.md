# RateLimitedError

RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base.

## Example Usage

```typescript
import { RateLimitedError } from "@auditlocker/sdk/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                      | Type                                                                       | Required                                                                   | Description                                                                | Example                                                                    |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `type`                                                                     | *string*                                                                   | :heavy_check_mark:                                                         | URI reference identifying the error type                                   | https://api.auditlocker.co/errors/validation_error                         |
| `title`                                                                    | *string*                                                                   | :heavy_check_mark:                                                         | Human-readable summary of the error type                                   | Validation Error                                                           |
| `status`                                                                   | [models.RateLimitedErrorStatus](../../models/rate-limited-error-status.md) | :heavy_check_mark:                                                         | N/A                                                                        |                                                                            |
| `detail`                                                                   | *string*                                                                   | :heavy_minus_sign:                                                         | Human-readable explanation specific to this occurrence                     | actor.id must not be an email address                                      |
| `instance`                                                                 | *string*                                                                   | :heavy_minus_sign:                                                         | URI reference identifying this specific occurrence (request ID)            | urn:uuid:01912f77-1234-7890-abcd-ef0123456789                              |
| `code`                                                                     | [models.RateLimitedErrorCode](../../models/rate-limited-error-code.md)     | :heavy_minus_sign:                                                         | N/A                                                                        |                                                                            |
| `retryAfter`                                                               | *number*                                                                   | :heavy_minus_sign:                                                         | Seconds until the next request may succeed.                                |                                                                            |