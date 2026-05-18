# RequiredScope

## Example Usage

```typescript
import { RequiredScope } from "@auditlocker/sdk/models";

let value: RequiredScope = "query:read";

// Open enum: unrecognized values are captured as Unrecognized<string>
```

## Values

```typescript
"ingest:write" | "query:read" | Unrecognized<string>
```