/**
 * Prevents the inclusion of the `<?xml` tag in SVG files. This tag will cause rendering issues.
 * Example: https://github.com/marsfoundation/spark-app/pull/107
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { globby } from 'globby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const assetsPath = path.join(__dirname, '../src/ui/assets')

const paths = await globby(['**/*.svg'], { cwd: assetsPath, absolute: true })
const erroredPaths: string[] = []

// biome-ignore lint/suspicious/noConsoleLog: <explanation>
console.log(`Verifying ${paths.length} SVGs...`)
for (const p of paths) {
  const content = await readFileSync(p, 'utf8')
  if (content.includes('<?xml')) {
    erroredPaths.push(p)
  }
}

if (erroredPaths.length > 0) {
  // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
  console.error(`Delete unnecessary <?xml tag from the following SVGs:`)
  for (const p of erroredPaths) {
    console.error(`  - ${p}`)
  }
  process.exit(1)
}
