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
const errors: { msg: string; file: string }[] = []

// biome-ignore lint/suspicious/noConsoleLog: <explanation>
console.log(`Verifying ${paths.length} SVGs...`)
for (const p of paths) {
  const content = await readFileSync(p, 'utf8')
  if (content.includes('<?xml')) {
    errors.push({ file: p, msg: 'Found <?xml tag' })
  }
  if (startsWithWhitespace(content)) {
    errors.push({ file: p, msg: 'Starts with whitespace' })
  }
}

if (errors.length > 0) {
  console.error(`${errors.length} problems found:`)
  for (const p of errors) {
    console.error(`  - ${p.file}: ${p.msg}`)
  }
  process.exit(1)
}

function startsWithWhitespace(str) {
  const regex = /^[\s]/
  return regex.test(str)
}
