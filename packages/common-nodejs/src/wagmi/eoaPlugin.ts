import { CheckedAddress } from '@marsfoundation/common-universal'
import { Plugin } from '@wagmi/cli'

type Addresses = Record<number, CheckedAddress>

export function eoa(input: Record<string, Addresses>): Plugin {
  return {
    name: 'EOA Addresses',
    async run() {
      const result = Object.entries(input).map(([name, addresses]) => {
        if (!isValidVariableName(name)) {
          throw new Error(`Invalid name: ${name}`)
        }
        const parts = Object.entries(addresses).map(
          ([chain, address]) => `  ${chain}: CheckedAddress('${address.toString()}'),`,
        )
        return [`export const ${name}Address = {`, ...parts, '} as const'].join('\n')
      })
      return {
        content: result.join('\n'),
        imports: "import { CheckedAddress } from '@marsfoundation/common-universal'\n",
      }
    },
  }
}

function isValidVariableName(name: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(name)
}
