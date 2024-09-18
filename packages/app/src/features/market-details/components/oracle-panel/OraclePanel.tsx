import { OracleType } from '@/config/chain/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { FixedOraclePanel } from './components/FixedOraclePanel'
import { MarketOraclePanel } from './components/MarketOraclePanel'
import { UnderlyingAssetOraclePanel } from './components/UnderlyingAssetOraclePanel'
import { UnknownOraclePanel } from './components/UnknownOraclePanel'
import { YieldingFixedOraclePanel } from './components/YieldingFixedOraclePanel'

export interface OraclePanelProps {
  oracle: OracleType
  marketInfo: MarketInfo
  chainId: number
}

export function OraclePanel(props: OraclePanelProps) {
  switch (props?.oracle?.type) {
    case 'fixed':
      return <FixedOraclePanel {...props} oracle={props.oracle} />
    case 'market-price':
      return <MarketOraclePanel {...props} oracle={props.oracle} />
    case 'yielding-fixed':
      return <YieldingFixedOraclePanel {...props} oracle={props.oracle} />
    case 'underlying-asset':
      return <UnderlyingAssetOraclePanel {...props} oracle={props.oracle} />
    default:
      return <UnknownOraclePanel {...props} />
  }
}
