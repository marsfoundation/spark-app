import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { toBigInt } from '@/utils/bigNumber'
import { queryOptions } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber } from '../../types/NumericValues'
import { calculateGemMinAmountOut } from './utils/calculateGemMinAmountOut'

export interface GemMinAmountOutKeyParams {
  psmActions: CheckedAddress
  gemDecimals: number
  assetsTokenDecimals: number
  sharesAmount: BaseUnitNumber
  chainId: number
}

export interface GemMinAmountOutOptionsParams extends GemMinAmountOutKeyParams {
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function gemMinAmountOutQueryOptions({
  psmActions,
  gemDecimals,
  assetsTokenDecimals,
  sharesAmount,
  chainId,
  config,
}: GemMinAmountOutOptionsParams) {
  return queryOptions({
    queryKey: gemMinAmountOutQueryKey({ psmActions, gemDecimals, assetsTokenDecimals, sharesAmount, chainId }),
    queryFn: async () => {
      const vault = await readContract(config, {
        address: psmActions,
        abi: psmActionsAbi,
        functionName: 'savingsToken',
      })

      const assetsAmount = await readContract(config, {
        address: vault,
        abi: erc4626Abi,
        functionName: 'convertToAssets',
        args: [toBigInt(sharesAmount)],
      })

      return calculateGemMinAmountOut({ gemDecimals, assetsTokenDecimals, assetsAmount })
    },
  })
}

export function gemMinAmountOutQueryKey({
  gemDecimals,
  assetsTokenDecimals,
  psmActions,
  sharesAmount,
  chainId,
}: GemMinAmountOutKeyParams): unknown[] {
  return ['gem-min-amount-out', gemDecimals, assetsTokenDecimals, psmActions, sharesAmount, chainId]
}
