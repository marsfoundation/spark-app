import { baseSavingsInfoQueryFunction } from '@/domain/savings-info/baseSavingsInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assertNever } from '@/utils/assertNever'
import { erc4626Abi, etherUnits, formatUnits, parseUnits } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { TokenConfig } from './types'

export interface CreateOraclePriceFetcherParams {
  tokenConfig: TokenConfig
  wagmiConfig: Config
  timestamp: number
  chainId: number
}

export function createOraclePriceFetcher({
  tokenConfig,
  wagmiConfig,
  timestamp,
  chainId,
}: CreateOraclePriceFetcherParams): () => Promise<NormalizedUnitNumber> {
  switch (tokenConfig.oracleType) {
    case 'zero-price':
      return async () => NormalizedUnitNumber(0)

    case 'fixed-usd':
      return async () => NormalizedUnitNumber(1)

    case 'vault':
      return async () => {
        const result = await readContract(wagmiConfig, {
          abi: erc4626Abi,
          address: tokenConfig.address,
          functionName: 'convertToAssets',
          args: [parseUnits('1', etherUnits.wei)],
          chainId,
        })

        return NormalizedUnitNumber(formatUnits(result, etherUnits.wei))
      }

    case 'ssr-auth-oracle':
      return async () => {
        const savingsInfo = await baseSavingsInfoQueryFunction({ wagmiConfig, timestamp, chainId })
        return savingsInfo.convertToAssets({ shares: NormalizedUnitNumber(1) })
      }

    default:
      assertNever(tokenConfig.oracleType)
  }
}
