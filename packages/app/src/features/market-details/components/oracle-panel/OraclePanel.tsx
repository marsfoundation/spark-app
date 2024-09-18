import { ReserveOracleType } from '@/config/chain/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { OracleInfo } from '@/domain/oracles/types'
import { assertNever } from '@/utils/assertNever'
import { FixedOraclePanel } from './components/FixedOraclePanel'
import { MarketOraclePanel } from './components/MarketOraclePanel'
import { UnderlyingAssetOraclePanel } from './components/UnderlyingAssetOraclePanel'
import { UnknownOraclePanel } from './components/UnknownOraclePanel'
import { YieldingFixedOraclePanel } from './components/YieldingFixedOraclePanel'
import { assert } from '@/utils/assert'

export interface OraclePanelProps {
  oracle: ReserveOracleType | undefined
  marketInfo: MarketInfo
  chainId: number
}

export function OraclePanel({ oracle, ...props }: OracleInfo) {
  if (!oracle) {
    return <UnknownOraclePanel {...props} />
  }

  switch (oracle.type) {
    case 'fixed':
      return <FixedOraclePanel {...props} oracle={oracle} />
    case 'market-price':
      return <MarketOraclePanel {...props} oracle={oracle} />
    case 'yielding-fixed': {
      const { baseToken, ratio } = props

      assert(baseToken && ratio, 'YieldingFixedOraclePanel requires baseToken and ratio')
      return <YieldingFixedOraclePanel {...props} baseToken={baseToken} ratio={ratio} oracle={oracle} />
    }
    case 'underlying-asset':
      return <UnderlyingAssetOraclePanel {...props} oracle={oracle} />

    default:
      assertNever(oracle)
  }
}
