# Events

## Overview

Audit event ingest and query operations

### Available Operations

* [ingest](#ingest) - Ingest a single audit event
* [list](#list) - Query audit events
* [ingestBatch](#ingestbatch) - Ingest a batch of audit events
* [get](#get) - Get a single audit event

## ingest

Accepts a single audit event, validates, and writes synchronously. Returns 201 Created with the event ID and server-assigned timestamp.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="ingestEvent" method="post" path="/v1/events" example="roleChange" -->
```typescript
import { AuditLocker } from "@auditlocker/sdk";

const auditLocker = new AuditLocker({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const result = await auditLocker.events.ingest({
    idempotencyKey: "evt_abc123_1714000000",
    body: {
      organizationId: "org_acme",
      actor: {
        id: "usr_a8f3k2",
        type: "user",
      },
      action: "user.role.changed",
      targets: [
        {
          type: "user",
          id: "usr_b1c4d8",
          name: "Bob",
        },
      ],
      metadata: {
        "changes": {
          "role": {
            "from": "member",
            "to": "admin",
          },
        },
      },
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuditLockerCore } from "@auditlocker/sdk/core.js";
import { eventsIngest } from "@auditlocker/sdk/funcs/events-ingest.js";

// Use `AuditLockerCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const auditLocker = new AuditLockerCore({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const res = await eventsIngest(auditLocker, {
    idempotencyKey: "evt_abc123_1714000000",
    body: {
      organizationId: "org_acme",
      actor: {
        id: "usr_a8f3k2",
        type: "user",
      },
      action: "user.role.changed",
      targets: [
        {
          type: "user",
          id: "usr_b1c4d8",
          name: "Bob",
        },
      ],
      metadata: {
        "changes": {
          "role": {
            "from": "member",
            "to": "admin",
          },
        },
      },
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("eventsIngest failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.IngestEventRequest](../../models/operations/ingest-event-request.md)                                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.IngestEventResponse](../../models/operations/ingest-event-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ValidationError           | 400                              | application/problem+json         |
| errors.UnauthenticatedError      | 401                              | application/problem+json         |
| errors.ScopeMismatchError        | 403                              | application/problem+json         |
| errors.IdempotencyConflictError  | 409                              | application/problem+json         |
| errors.PayloadTooLargeError      | 413                              | application/problem+json         |
| errors.UnsupportedMediaTypeError | 415                              | application/problem+json         |
| errors.RateLimitedError          | 429                              | application/problem+json         |
| errors.InternalError             | 500                              | application/problem+json         |
| errors.ServiceUnavailableError   | 503                              | application/problem+json         |
| errors.AuditLockerDefaultError   | 4XX, 5XX                         | \*/\*                            |

## list

Returns a paginated list of audit events matching the specified filters. Use the `cursor` parameter to fetch subsequent pages.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="listEvents" method="get" path="/v1/events" -->
```typescript
import { AuditLocker } from "@auditlocker/sdk";

const auditLocker = new AuditLocker({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const result = await auditLocker.events.list({});

  for await (const page of result) {
    console.log(page);
  }
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuditLockerCore } from "@auditlocker/sdk/core.js";
import { eventsList } from "@auditlocker/sdk/funcs/events-list.js";

// Use `AuditLockerCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const auditLocker = new AuditLockerCore({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const res = await eventsList(auditLocker, {});
  if (res.ok) {
    const { value: result } = res;
    for await (const page of result) {
    console.log(page);
  }
  } else {
    console.log("eventsList failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ListEventsRequest](../../models/operations/list-events-request.md)                                                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ListEventsResponse](../../models/operations/list-events-response.md)\>**

### Errors

| Error Type                     | Status Code                    | Content Type                   |
| ------------------------------ | ------------------------------ | ------------------------------ |
| errors.ValidationError         | 400                            | application/problem+json       |
| errors.UnauthenticatedError    | 401                            | application/problem+json       |
| errors.ScopeMismatchError      | 403                            | application/problem+json       |
| errors.RateLimitedError        | 429                            | application/problem+json       |
| errors.InternalError           | 500                            | application/problem+json       |
| errors.ServiceUnavailableError | 503                            | application/problem+json       |
| errors.AuditLockerDefaultError | 4XX, 5XX                       | \*/\*                          |

## ingestBatch

Accepts up to 500 audit events, validates each, and writes valid events synchronously. Returns 207 Multi-Status with per-event results. Some events may succeed while others fail validation.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="ingestEventBatch" method="post" path="/v1/events/batch" example="mixedBatch" -->
```typescript
import { AuditLocker } from "@auditlocker/sdk";

const auditLocker = new AuditLocker({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const result = await auditLocker.events.ingestBatch({
    idempotencyKey: "evt_abc123_1714000000",
    body: {
      events: [
        {
          organizationId: "org_acme",
          actor: {
            id: "usr_a8f3k2",
            type: "user",
          },
          action: "doc.shared",
          targets: [
            {
              type: "doc",
              id: "doc_42",
            },
          ],
        },
        {
          organizationId: "org_acme",
          actor: {
            id: "alice@example.com",
            type: "user",
          },
          action: "doc.viewed",
          targets: [
            {
              type: "doc",
              id: "doc_99",
            },
          ],
        },
      ],
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuditLockerCore } from "@auditlocker/sdk/core.js";
import { eventsIngestBatch } from "@auditlocker/sdk/funcs/events-ingest-batch.js";

// Use `AuditLockerCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const auditLocker = new AuditLockerCore({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const res = await eventsIngestBatch(auditLocker, {
    idempotencyKey: "evt_abc123_1714000000",
    body: {
      events: [
        {
          organizationId: "org_acme",
          actor: {
            id: "usr_a8f3k2",
            type: "user",
          },
          action: "doc.shared",
          targets: [
            {
              type: "doc",
              id: "doc_42",
            },
          ],
        },
        {
          organizationId: "org_acme",
          actor: {
            id: "alice@example.com",
            type: "user",
          },
          action: "doc.viewed",
          targets: [
            {
              type: "doc",
              id: "doc_99",
            },
          ],
        },
      ],
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("eventsIngestBatch failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.IngestEventBatchRequest](../../models/operations/ingest-event-batch-request.md)                                                                                    | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.IngestEventBatchResponse](../../models/operations/ingest-event-batch-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ValidationError           | 400                              | application/problem+json         |
| errors.UnauthenticatedError      | 401                              | application/problem+json         |
| errors.ScopeMismatchError        | 403                              | application/problem+json         |
| errors.IdempotencyConflictError  | 409                              | application/problem+json         |
| errors.PayloadTooLargeError      | 413                              | application/problem+json         |
| errors.UnsupportedMediaTypeError | 415                              | application/problem+json         |
| errors.RateLimitedError          | 429                              | application/problem+json         |
| errors.InternalError             | 500                              | application/problem+json         |
| errors.ServiceUnavailableError   | 503                              | application/problem+json         |
| errors.AuditLockerDefaultError   | 4XX, 5XX                         | \*/\*                            |

## get

Retrieves a single audit event by its ID. Returns 404 if the event does not exist or belongs to a different project.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="getEvent" method="get" path="/v1/events/{id}" -->
```typescript
import { AuditLocker } from "@auditlocker/sdk";

const auditLocker = new AuditLocker({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const result = await auditLocker.events.get({
    id: "09f9234a-1e79-46a9-b3c1-d055b6d2a78c",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AuditLockerCore } from "@auditlocker/sdk/core.js";
import { eventsGet } from "@auditlocker/sdk/funcs/events-get.js";

// Use `AuditLockerCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const auditLocker = new AuditLockerCore({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  const res = await eventsGet(auditLocker, {
    id: "09f9234a-1e79-46a9-b3c1-d055b6d2a78c",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("eventsGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetEventRequest](../../models/operations/get-event-request.md)                                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GetEventResponse](../../models/operations/get-event-response.md)\>**

### Errors

| Error Type                     | Status Code                    | Content Type                   |
| ------------------------------ | ------------------------------ | ------------------------------ |
| errors.ValidationError         | 400                            | application/problem+json       |
| errors.UnauthenticatedError    | 401                            | application/problem+json       |
| errors.ScopeMismatchError      | 403                            | application/problem+json       |
| errors.NotFoundError           | 404                            | application/problem+json       |
| errors.RateLimitedError        | 429                            | application/problem+json       |
| errors.InternalError           | 500                            | application/problem+json       |
| errors.ServiceUnavailableError | 503                            | application/problem+json       |
| errors.AuditLockerDefaultError | 4XX, 5XX                       | \*/\*                          |