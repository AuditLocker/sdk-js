# @auditlocker/sdk

JavaScript / TypeScript SDK for [AuditLocker](https://auditlocker.co) — the managed audit-logging service for B2B SaaS.

> **Status:** pre-release. The public API is not yet stable. Generated from the
> AuditLocker OpenAPI spec via [Speakeasy](https://www.speakeasy.com/); `src/`
> is generated code — do not hand-edit it (see [AGENTS.md](./AGENTS.md)).
> Consumer usage is documented in the auto-generated sections below.

## Distribution

- **npm:** `@auditlocker/sdk` — dual **CJS + ESM** (ESM is the primary entry; CJS exists for legacy consumers)
- **Runtimes:** Node 22+, modern bundlers, edge runtimes (Cloudflare Workers, Deno, Bun)
- **Publish:** npm provenance via Sigstore (links every published tarball to the exact git commit and CI run)

## Development

This repo uses [pnpm 11](https://pnpm.io/) with a deliberately strict, secure-by-default toolchain (oxlint / oxfmt / tsgo — no ESLint, Prettier, or tsc). The full operational guide lives in [AGENTS.md](./AGENTS.md). Quickstart:

```bash
nvm use                                   # switch to Node 24 (.nvmrc)
pnpm install                              # respects strictDepBuilds + engine-strict

# Run any gate
pnpm typecheck                            # tsgo --noEmit
pnpm lint                                 # oxlint
pnpm format                               # oxfmt --check (format:fix to write)
pnpm test                                 # vitest
pnpm build                                # tshy → dist/ (dual CJS+ESM)
pnpm publint                              # package.json validation
pnpm attw                                 # type export correctness (node16 profile)
pnpm run audit:ci                         # audit-ci (moderate+ threshold)

# Regenerate the SDK (maintainer task; spec source is maintainer config)
pnpm regen                                # speakeasy run + repoint-entry + install + build
```

> `pnpm regen` — never bare `speakeasy run`. Speakeasy rewrites
> `package.json` `tshy.exports["."]` back to the generated `src/index.ts` on
> every run; `scripts/repoint-entry.mjs` (chained by `pnpm regen`) restores the
> hand-written facade as the package entry. `test/regen-survival.test.ts`
> fails loudly if a regen ever lands without it.

### Supply-chain hardening

Supply-chain hardening in `pnpm-workspace.yaml`:

| Concern                                     | Setting                                           |
| ------------------------------------------- | ------------------------------------------------- |
| Refuse packages younger than 7 days         | `minimumReleaseAge: 10080`                        |
| No unreviewed postinstall scripts           | `strictDepBuilds: true` + `allowBuilds`           |
| Publisher regression detection              | `trustPolicy: no-downgrade`                       |
| Registry-only transitive deps               | `blockExoticSubdeps: true`                        |
| Peer dep mismatches are errors              | `strictPeerDependencies: true`                    |
| Verify node_modules before every script     | `verifyDepsBeforeRun: error`                      |
| Lockfile includes tarball URLs              | `lockfileIncludeTarballUrl: true`                 |
| 7-day Dependabot cooldown on all severities | `.github/dependabot.yml`                          |
| CI vulnerability gate at moderate+          | audit-ci via `pnpm dlx` (runs BEFORE install)     |
| npm provenance attestation on publish       | `publishConfig.provenance: true`                  |

SDK-specific publish-time gates (**publint** + **attw**) validate that the package.json exports and type declarations are correct before any release.

## Usage essentials

The package entry is the hand-written `AuditLocker` facade — a single entry
point per concern: `emit` / `emitBatch` for writes, `list` / `get` for reads.
The generated client's `events` namespace is intentionally not exposed (no
`raw` escape hatch) so the behaviours below cannot be bypassed.

```ts
import { AuditLocker } from '@auditlocker/sdk'

const audit = new AuditLocker({
  apiKey: process.env.AUDITLOCKER_API_KEY!,
  // optional:
  defaultSource: 'worker',
  onDlpRedaction: (e) => log.warn('audit field redacted', e),
})

const res = await audit.emit({
  organizationId: 'org_123',
  actor: { id: 'usr_1', type: 'user' },
  action: 'user.role.changed',
  targets: [{ type: 'user', id: 'usr_2' }],
})
// res is the IngestResponse directly — { id, receivedAt, dlpRedactedFields, ... }
```

### Idempotency

Every `emit` / `emitBatch` carries an `Idempotency-Key`. If you don't pass one,
the SDK auto-mints `al-sdk-js-<uuid>` — the `al-sdk-js-` prefix marks it as
SDK-minted in your API logs (customer-supplied keys never use that prefix).
Pass your own to make retries safe across process boundaries:

```ts
const key = `order-${orderId}-provisioned`
try {
  await audit.emit(event, { idempotencyKey: key })
} catch (e) {
  await audit.emit(event, { idempotencyKey: key }) // server dedupes — no double-write
}
```

The key is fixed once per call and **replayed unchanged** across the SDK's
automatic retries (429 / 5xx). On `emitBatch` the key is **per batch**: a
replay re-applies the whole `events` array atomically; to retry only the
rejected items, build a new batch (it gets a new key).

### The `source` field

`source` is your own taxonomy of where an event originated in your stack
(`'web'`, `'worker'`, `'cron'`, …) — the API never branches on it and enforces
no vocabulary, so pick a small fixed set per project for your own query-time
filters. When omitted it defaults to `'api'` (override via the `defaultSource`
constructor option, or per-call / per-element `source`).

### Catching errors

Three buckets. Every typed HTTP error extends `AuditLockerError` (one class per
status — `ValidationError`, `ScopeMismatchError`, `RateLimitedError`, …);
malformed responses throw `SDKValidationError`; transport failures throw the
network-error siblings.

```ts
import { AuditLockerError, SDKValidationError } from '@auditlocker/sdk'

try {
  await audit.emit(event)
} catch (e) {
  if (e instanceof AuditLockerError) {
    // typed API error — inspect e (e.g. RateLimitedError#retryAfter)
  } else if (e instanceof SDKValidationError) {
    // server sent a body the SDK could not validate
  } else {
    throw e // network / unknown — let it propagate
  }
}
```

`onDlpRedaction` is an out-of-band notification path (fire-and-forget; a
throwing callback is logged once and swallowed). It does **not** replace the
return value — `dlpRedactedFields` is on the `emit` result regardless of
whether you register the callback.

## License

Apache-2.0

<!-- Start Summary [summary] -->
## Summary

AuditLocker API: Audit event ingest and query API for compliance-ready logging.
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [@auditlocker/sdk](#auditlockersdk)
  * [Distribution](#distribution)
  * [Development](#development)
  * [Usage essentials](#usage-essentials)
  * [License](#license)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Authentication](#authentication)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Pagination](#pagination)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

> [!TIP]
> To finish publishing your SDK to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).


The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET>
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

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
<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name     | Type | Scheme      | Environment Variable  |
| -------- | ---- | ----------- | --------------------- |
| `apiKey` | http | HTTP Bearer | `AUDITLOCKER_API_KEY` |

To authenticate with the API the `apiKey` parameter must be set when initializing the SDK client instance. For example:
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
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [Events](docs/sdks/events/README.md)

* [ingest](docs/sdks/events/README.md#ingest) - Ingest a single audit event
* [list](docs/sdks/events/README.md#list) - Query audit events
* [ingestBatch](docs/sdks/events/README.md#ingestbatch) - Ingest a batch of audit events
* [get](docs/sdks/events/README.md#get) - Get a single audit event

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`eventsGet`](docs/sdks/events/README.md#get) - Get a single audit event
- [`eventsIngest`](docs/sdks/events/README.md#ingest) - Ingest a single audit event
- [`eventsIngestBatch`](docs/sdks/events/README.md#ingestbatch) - Ingest a batch of audit events
- [`eventsList`](docs/sdks/events/README.md#list) - Query audit events

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Pagination [pagination] -->
## Pagination

Some of the endpoints in this SDK support pagination. To use pagination, you
make your SDK calls as usual, but the returned response object will also be an
async iterable that can be consumed using the [`for await...of`][for-await-of]
syntax.

[for-await-of]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

Here's an example of one such pagination call:

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
<!-- End Pagination [pagination] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
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
  }, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { AuditLocker } from "@auditlocker/sdk";

const auditLocker = new AuditLocker({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
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
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`AuditLockerError`](./src/models/errors/audit-locker-error.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { AuditLocker } from "@auditlocker/sdk";
import * as errors from "@auditlocker/sdk/models/errors";

const auditLocker = new AuditLocker({
  apiKey: process.env["AUDITLOCKER_API_KEY"] ?? "",
});

async function run() {
  try {
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
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.AuditLockerError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.ValidationError) {
        console.log(error.data$.type); // string
        console.log(error.data$.title); // string
        console.log(error.data$.status); // models.ValidationErrorStatus
        console.log(error.data$.detail); // string
        console.log(error.data$.instance); // string
      }
    }
  }
}

run();

```

### Error Classes
**Primary errors:**
* [`AuditLockerError`](./src/models/errors/audit-locker-error.ts): The base class for HTTP error responses.
  * [`ValidationError`](./src/models/errors/validation-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `400`.
  * [`UnauthenticatedError`](./src/models/errors/unauthenticated-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `401`.
  * [`ScopeMismatchError`](./src/models/errors/scope-mismatch-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `403`.
  * [`RateLimitedError`](./src/models/errors/rate-limited-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `429`.
  * [`InternalError`](./src/models/errors/internal-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `500`.
  * [`ServiceUnavailableError`](./src/models/errors/service-unavailable-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `503`.

<details><summary>Less common errors (10)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/http-client-errors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/http-client-errors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/http-client-errors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/http-client-errors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/http-client-errors.ts): Unrecognised or unexpected error.


**Inherit from [`AuditLockerError`](./src/models/errors/audit-locker-error.ts)**:
* [`IdempotencyConflictError`](./src/models/errors/idempotency-conflict-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `409`. Applicable to 2 of 4 methods.*
* [`PayloadTooLargeError`](./src/models/errors/payload-too-large-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `413`. Applicable to 2 of 4 methods.*
* [`UnsupportedMediaTypeError`](./src/models/errors/unsupported-media-type-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `415`. Applicable to 2 of 4 methods.*
* [`NotFoundError`](./src/models/errors/not-found-error.ts): RFC 9457 Problem Details error response. All error responses follow this format. Match on `code` for programmatic handling; per-status narrowed schemas allOf this base. Status code `404`. Applicable to 1 of 4 methods.*
* [`ResponseValidationError`](./src/models/errors/response-validation-error.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>

\* Check [the method documentation](#available-resources-and-operations) to see if the error is applicable.
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { AuditLocker } from "@auditlocker/sdk";

const auditLocker = new AuditLocker({
  serverURL: "https://api.auditlocker.co",
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
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to:
- route requests through a proxy server using [undici](https://www.npmjs.com/package/undici)'s ProxyAgent
- use the `"beforeRequest"` hook to add a custom header and a timeout to requests
- use the `"requestError"` hook to log errors

```typescript
import { AuditLocker } from "@auditlocker/sdk";
import { ProxyAgent } from "undici";
import { HTTPClient } from "@auditlocker/sdk/lib/http";

const dispatcher = new ProxyAgent("http://proxy.example.com:8080");

const httpClient = new HTTPClient({
  // 'fetcher' takes a function that has the same signature as native 'fetch'.
  fetcher: (input, init) =>
    // 'dispatcher' is specific to undici and not part of the standard Fetch API.
    fetch(input, { ...init, dispatcher } as RequestInit),
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new AuditLocker({ httpClient: httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { AuditLocker } from "@auditlocker/sdk";

const sdk = new AuditLocker({ debugLogger: console });
```

You can also enable a default debug logger by setting an environment variable `AUDITLOCKER_DEBUG` to true.
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->
