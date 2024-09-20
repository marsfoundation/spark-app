import { getChainConfigEntry } from '@/config/chain'
import { assert } from '@/utils/assert'
import { queryOptions } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { MarketInfo, Reserve } from '../market-info/marketInfo'
import { NormalizedUnitNumber } from '../types/NumericValues'
import { OracleInfo } from './types'

interface OracleQueryParams {
  reserve: Reserve
  marketInfo: MarketInfo
  wagmiConfig: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function oracleQueryOptions({ reserve, marketInfo, wagmiConfig }: OracleQueryParams) {
  return queryOptions<OracleInfo>({
    queryKey: oracleInfoQueryKey({ reserve, marketInfo }),
    queryFn: async () => {
      const oracleConfig = getChainConfigEntry(marketInfo.chainId).oracles[reserve.token.symbol]

      const oracleInfo: OracleInfo = {
        oracle: oracleConfig,
        token: reserve.token,
        price: NormalizedUnitNumber(reserve.priceInUSD),
        priceOracleAddress: reserve.priceOracle,
        chainId: marketInfo.chainId,
        baseTokenReserve: undefined,
        ratio: undefined,
      }

      if (oracleConfig?.type === 'yielding-fixed') {
        const baseTokenReserve = marketInfo.findReserveBySymbol(oracleConfig.baseAsset)

        assert(baseTokenReserve, `Base token ${oracleConfig.baseAsset} not found`)
        const ratio = await oracleConfig.ratio({ reserve, wagmiConfig })

        return {
          ...oracleInfo,
          baseTokenReserve,
          ratio,
        }
      }

      return oracleInfo
    },
  })
}

export function oracleInfoQueryKey({ marketInfo, reserve }: Omit<OracleQueryParams, 'wagmiConfig'>): unknown[] {
  return ['oracle', marketInfo.chainId, reserve.token.address]
}
