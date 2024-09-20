import { ReserveOracleType } from '@/config/chain/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { UseOracleInfoResult } from '@/domain/oracles/useOracleInfo'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { assert } from '@/utils/assert'
import { assertNever } from '@/utils/assertNever'
import { FixedOraclePanel } from './components/FixedOraclePanel'
import { MarketOraclePanel } from './components/MarketOraclePanel'
import { UnderlyingAssetOraclePanel } from './components/UnderlyingAssetOraclePanel'
import { UnknownOraclePanel } from './components/UnknownOraclePanel'
import { YieldingFixedOraclePanel } from './components/YieldingFixedOraclePanel'

export interface OraclePanelProps {
  oracle: ReserveOracleType | undefined
  marketInfo: MarketInfo
  chainId: number
}

export function OraclePanel({ data, isLoading, error }: UseOracleInfoResult) {
  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (!data || error) return null

  const { oracle, ...props } = data

  if (!oracle) {
    return <UnknownOraclePanel {...props} />
  }

  switch (oracle.type) {
    case 'fixed':
      return <FixedOraclePanel {...props} oracle={oracle} />
    case 'market-price':
      return <MarketOraclePanel {...props} oracle={oracle} />
    case 'yielding-fixed': {
      const { baseTokenReserve, ratio } = props

      assert(baseTokenReserve && ratio, 'YieldingFixedOraclePanel requires baseToken and ratio')
      return <YieldingFixedOraclePanel {...props} baseTokenReserve={baseTokenReserve} ratio={ratio} oracle={oracle} />
    }
    case 'underlying-asset':
      return <UnderlyingAssetOraclePanel {...props} oracle={oracle} />

    default:
      assertNever(oracle)
  }
}
