import { OracleType } from '@/config/chain/types'
import { Panel } from '@/ui/atoms/panel/Panel'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { zeroAddress } from 'viem'
import { BlockExplorerAddressLink } from './BlockExplorerAddressLink'
import { ProvidersList } from './ProvidersList'

interface MarketOraclePanelProps {
  oracle: Extract<OracleType, { type: 'market-price' }>
  chainId: number
}

export function MarketOraclePanel({ oracle, chainId }: MarketOraclePanelProps) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <div>
        <div className="mb-1 text-slate-500 text-sm leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">
            Market Price {oracle.providedBy.length > 1 && <span className="text-gray-500">(Redundant)</span>}
          </Panel.Title>

          <Info size={16}>Some info</Info>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <InfoTile>
            <InfoTile.Label>Price</InfoTile.Label>
            <InfoTile.Value>TBD</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Asset</InfoTile.Label>
            <InfoTile.Value>TBD</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={zeroAddress} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>
        </div>
        <ProvidersList providers={oracle.providedBy} />
      </Panel.Content>
    </Panel.Wrapper>
  )
}
