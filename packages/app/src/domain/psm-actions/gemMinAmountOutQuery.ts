import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { toBigInt } from '@/utils/bigNumber'
import { queryOptions } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'

export interface GemMinAmountOutKeyParams {
  psmActions: CheckedAddress
  shares: BaseUnitNumber
  chainId: number
}

export interface GemMinAmountOutOptionsParams extends GemMinAmountOutKeyParams {
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function gemMinAmountOutQueryOptions({ psmActions, shares, chainId, config }: GemMinAmountOutOptionsParams) {
  return queryOptions({
    queryKey: gemMinAmountOutQueryKey({ psmActions, shares, chainId }),
    queryFn: async () => {
      const vault = await readContract(config, {
        address: psmActions,
        abi: psmActionsAbi,
        functionName: 'savingsToken',
      })

      const gemMinAmountOut = await readContract(config, {
        address: vault,
        abi: erc4626Abi,
        functionName: 'convertToAssets',
        args: [toBigInt(shares)],
      })

      return gemMinAmountOut
    },
  })
}

export function gemMinAmountOutQueryKey({ psmActions, shares, chainId }: GemMinAmountOutKeyParams): unknown[] {
  return ['convert-to-assets', chainId, psmActions, shares]
}
