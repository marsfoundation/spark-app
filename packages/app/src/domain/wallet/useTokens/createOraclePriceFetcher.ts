import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
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
  if (tokenConfig.reserveOracleType === 'fixed-usd') {
    return async () => NormalizedUnitNumber(1)
  }

  if (tokenConfig.reserveOracleType === 'vault') {
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
  }

  throw new Error('Unknown oracle type')
}
