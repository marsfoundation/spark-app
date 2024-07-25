import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { erc4626Abi, etherUnits, formatUnits, parseUnits } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { TokenConfig } from './types'

export interface CreateOraclePriceFetcherParams {
  tokenConfig: TokenConfig
  wagmiConfig: Config
}

export function createOraclePriceFetcher({
  tokenConfig,
  wagmiConfig,
}: CreateOraclePriceFetcherParams): () => Promise<NormalizedUnitNumber> {
  if (tokenConfig.oracleType === 'fixed-usd') {
    return async () => NormalizedUnitNumber(1)
  }

  if (tokenConfig.oracleType === 'erc4626') {
    return async () => {
      const result = await readContract(wagmiConfig, {
        abi: erc4626Abi,
        address: tokenConfig.address,
        functionName: 'convertToAssets',
        args: [parseUnits('1', etherUnits.wei)],
      })

      return NormalizedUnitNumber(formatUnits(result, etherUnits.wei))
    }
  }

  throw new Error('Unknown oracle type')
}
