import { Plugin } from '@wagmi/cli'
import { expect } from 'earl'
import { zeroAddress } from 'viem'
import { base, mainnet } from 'viem/chains'
import { CheckedAddress } from '../types/CheckedAddress.js'
import { eoa } from './eoaPlugin.js'

describe(eoa.name, () => {
  const firstAddress = CheckedAddress('0x0000000000000000000000000000000000000001')
  const secondAddress = CheckedAddress('0x0000000000000000000000000000000000000002')

  it('returns record with single address', async () => {
    const plugin = eoa({
      someEoa: {
        [mainnet.id]: CheckedAddress(zeroAddress),
      },
    })

    const result = await plugin.run?.(testRunConfig)
    const lines = [
      'export const someEoaAddress = {',
      '  1: "0x0000000000000000000000000000000000000000",',
      '} as const',
    ].join('\n')
    expect(result?.content).toEqual(lines)
  })

  it('returns multiple records with multiple addresses', async () => {
    const plugin = eoa({
      firstEoa: {
        [mainnet.id]: CheckedAddress(zeroAddress),
        [base.id]: CheckedAddress(firstAddress),
      },
      secondEoa: {
        [mainnet.id]: CheckedAddress(firstAddress),
        [base.id]: CheckedAddress(secondAddress),
      },
    })

    const result = await plugin.run?.(testRunConfig)
    const lines = [
      'export const firstEoaAddress = {',
      '  1: "0x0000000000000000000000000000000000000000",',
      '  8453: "0x0000000000000000000000000000000000000001",',
      '} as const',
      'export const secondEoaAddress = {',
      '  1: "0x0000000000000000000000000000000000000001",',
      '  8453: "0x0000000000000000000000000000000000000002",',
      '} as const',
    ].join('\n')
    expect(result?.content).toEqual(lines)
  })

  it('throws if the name is invalid', async () => {
    const plugin = eoa({
      '12345someEoa': {
        [mainnet.id]: CheckedAddress(zeroAddress),
      },
    })

    const promisedResult = plugin.run?.(testRunConfig)
    await expect(async () => promisedResult).toBeRejectedWith('Invalid name: 12345someEoa')
  })
})

const testRunConfig: Parameters<Required<Plugin>['run']>[0] = {
  contracts: [],
  outputs: [],
  isTypeScript: true,
}
