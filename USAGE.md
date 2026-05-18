<!-- Start SDK Example Usage [usage] -->
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