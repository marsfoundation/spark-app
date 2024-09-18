import { OracleType } from '@/config/chain/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { FixedOraclePanel } from './components/FixedOraclePanel'
import { MarketOraclePanel } from './components/MarketOraclePanel'
import { UnderlyingAssetOraclePanel } from './components/UnderlyingAssetOraclePanel'
import { UnknownOraclePanel } from './components/UnknownOraclePanel'
import { YieldingFixedOraclePanel } from './components/YieldingFixedOraclePanel'

export interface OraclePanelProps {
  oracle: OracleType | undefined
  marketInfo: MarketInfo
  chainId: number
}

export function OraclePanel({ oracle, ...props }: OraclePanelProps) {
  switch (oracle?.type) {
    case 'fixed':
      return <FixedOraclePanel {...props} oracle={oracle} />
    case 'market-price':
      return <MarketOraclePanel {...props} oracle={oracle} />
    case 'yielding-fixed':
      return <YieldingFixedOraclePanel {...props} oracle={oracle} />
    case 'underlying-asset':
      return <UnderlyingAssetOraclePanel {...props} oracle={oracle} />
    default:
      return <UnknownOraclePanel {...props} />
  }
}
