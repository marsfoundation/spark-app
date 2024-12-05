import { ssrAuthOracleConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { assertNever } from '@/utils/assertNever'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRay } from '@/utils/math'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { erc4626Abi, etherUnits, formatUnits, parseUnits } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { TokenConfig } from './types'

export interface CreateOraclePriceFetcherParams {
  tokenConfig: TokenConfig
  wagmiConfig: Config
  chainId: number
}

export function createOraclePriceFetcher({
  tokenConfig,
  wagmiConfig,
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
        const result = await readContract(wagmiConfig, {
          abi: ssrAuthOracleConfig.abi,
          address: getContractAddress(ssrAuthOracleConfig.address, chainId),
          functionName: 'getConversionRate',
          chainId,
        })

        return NormalizedUnitNumber(fromRay(bigNumberify(result)))
      }

    default:
      assertNever(tokenConfig.oracleType)
  }
}
