// Bundle-size gate for @auditlocker/sdk.
//
// Measures the minified ESM bundle two ways via rolldown (the modern Vite
// engine; pinned exact in package.json devDependencies — neither rolldown
// nor esbuild is exposed as a bin, so this script is the invocation):
//
//   - combined (SDK + Zod): what a bundling consumer actually ships. This
//     is the FAILING gate.
//   - sdk-only (Zod marked external): our own code only. INFORMATIONAL —
//     logged for trend visibility, never fails the build (a tree-shaking
//     consumer pulls Zod too, so this number doesn't reflect their ship).
//
// Budget: 81_505 B = the 67_921 B measured 2026-05-18 (rolldown
// 1.0.0-rc.18, `dist/esm/index.js`) + 20% headroom. Trips
// on a material regression, not noise. Re-baseline deliberately if the
// pinned rolldown is bumped (RC minification can shift a few %).

import { rolldown } from 'rolldown'

const MAX_COMBINED_BYTES = 81_505
const ENTRY = 'dist/esm/index.js'

async function bundleBytes(external) {
  const bundle = await rolldown({ input: ENTRY, ...(external ? { external } : {}) })
  const { output } = await bundle.generate({ format: 'es', minify: true })
  await bundle.close()
  return output
    .filter((chunk) => chunk.type === 'chunk')
    .reduce((total, chunk) => total + Buffer.byteLength(chunk.code), 0)
}

const combined = await bundleBytes()
const sdkOnly = await bundleBytes([/^zod($|\/)/])

const kib = (n) => `${(n / 1024).toFixed(1)} KiB`
console.log(`bundle-size (rolldown, minified ESM):`)
console.log(`  combined (SDK + Zod): ${combined} B (${kib(combined)})  [gate]`)
console.log(`  sdk-only (Zod ext.):  ${sdkOnly} B (${kib(sdkOnly)})  [informational]`)
console.log(`  budget (combined):    ${MAX_COMBINED_BYTES} B (${kib(MAX_COMBINED_BYTES)})`)

if (combined > MAX_COMBINED_BYTES) {
  console.error(
    `::error::Combined bundle ${combined} B exceeds the ${MAX_COMBINED_BYTES} B budget ` +
      `(+${(((combined - MAX_COMBINED_BYTES) / MAX_COMBINED_BYTES) * 100).toFixed(1)}%). ` +
      `Prune, or re-baseline deliberately.`,
  )
  process.exit(1)
}
console.log(`✓ within budget`)
