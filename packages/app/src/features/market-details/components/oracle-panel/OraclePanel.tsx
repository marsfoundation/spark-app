<<<<<<< HEAD
import { ReserveOracleType } from '@/config/chain/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { assertNever } from '@/utils/assertNever'
import { FixedOraclePanel } from './components/FixedOraclePanel'
import { MarketOraclePanel } from './components/MarketOraclePanel'
import { UnderlyingAssetOraclePanel } from './components/UnderlyingAssetOraclePanel'
import { UnknownOraclePanel } from './components/UnknownOraclePanel'
import { YieldingFixedOraclePanel } from './components/YieldingFixedOraclePanel'

export interface OraclePanelProps {
  oracle: ReserveOracleType | undefined
=======
import { OracleType } from '@/config/chain/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { raise } from '@/utils/assert'
import { FixedOraclePanel } from './components/FixedOraclePanel'
import { MarketOraclePanel } from './components/MarketOraclePanel'
import { UnderlyingAssetOraclePanel } from './components/UnderlyingAssetOraclePanel'
import { YieldingFixedOraclePanel } from './components/YieldingFixedOraclePanel'

export interface OraclePanelProps {
  oracle: OracleType
>>>>>>> 15c5bdc (Add oracle components)
  marketInfo: MarketInfo
  chainId: number
}

<<<<<<< HEAD
export function OraclePanel({ oracle, ...props }: OraclePanelProps) {
  if (!oracle) {
    return <UnknownOraclePanel {...props} />
  }

  switch (oracle.type) {
    case 'fixed':
      return <FixedOraclePanel {...props} oracle={oracle} />
    case 'market-price':
      return <MarketOraclePanel {...props} oracle={oracle} />
    case 'yielding-fixed':
      return <YieldingFixedOraclePanel {...props} oracle={oracle} />
    case 'underlying-asset':
      return <UnderlyingAssetOraclePanel {...props} oracle={oracle} />

    default:
      assertNever(oracle)
=======
export function OraclePanel(props: OraclePanelProps) {
  switch (props.oracle.type) {
    case 'fixed':
      return <FixedOraclePanel {...props} oracle={props.oracle} />
    case 'market-price':
      return <MarketOraclePanel {...props} oracle={props.oracle} />
    case 'yielding-fixed':
      return <YieldingFixedOraclePanel {...props} oracle={props.oracle} />
    case 'underlying-asset':
      return <UnderlyingAssetOraclePanel {...props} oracle={props.oracle} />

    default:
      raise('Unknown oracle type')
>>>>>>> 15c5bdc (Add oracle components)
  }
}
