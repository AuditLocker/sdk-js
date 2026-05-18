#!/usr/bin/env node
// Post-regeneration patch. Speakeasy OWNS `package.json` "tshy.exports" and
// rewrites it on every `speakeasy run`, ignoring `gen.yaml`
// additionalPackageJSON (verified empirically — additionalPackageJSON.tshy is
// NOT honoured). The package's public entry must be the hand-written facade
// at src/custom/index.ts, not the generated src/index.ts (which exports a
// same-named generated `AuditLocker`). This script re-points the `.` export
// after regeneration; `tshy` (build) then derives the resolved
// exports/main/module from it. Idempotent. Run it in the documented regen
// flow (see `pnpm regen`) and in the CI regen dry-run. test/regen-survival
// .test.ts fails loudly if a regen landed without this step.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ENTRY = './src/custom/index.ts'
const pkgPath = fileURLToPath(new URL('../package.json', import.meta.url))
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

if (!pkg.tshy?.exports) {
  console.error('[repoint-entry] package.json has no tshy.exports — aborting')
  process.exit(1)
}

if (pkg.tshy.exports['.'] === ENTRY) {
  console.log('[repoint-entry] entry already points at the facade — no change')
  process.exit(0)
}

pkg.tshy.exports['.'] = ENTRY
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(
  `[repoint-entry] tshy.exports["."] -> ${ENTRY} (run \`pnpm build\` to refresh resolved exports)`,
)
