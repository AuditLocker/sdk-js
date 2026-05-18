# Result


## Supported Types

### `models.BatchEventResultSuccess`

```typescript
const value: models.BatchEventResultSuccess = {
  status: "accepted",
  index: 281970,
  id: "<id>",
  receivedAt: new Date("2024-12-21T03:01:51.382Z"),
  dlpRedactedFields: [
    "<value 1>",
  ],
};
```

### `models.BatchEventResultError`

```typescript
const value: models.BatchEventResultError = {
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

