import { Panel } from '@/ui/atoms/panel/Panel'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { zeroAddress } from 'viem'
import { BlockExplorerAddressLink } from './BlockExplorerAddressLink'

interface UnknownOraclePanelProps {
  chainId: number
}

export function UnknownOraclePanel({ chainId }: UnknownOraclePanelProps) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <Panel.Header className="flex items-center gap-2">
        <Panel.Title className="text-xl">Oracle</Panel.Title>
        <Info size={16}>Some info</Info>
      </Panel.Header>
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
      </Panel.Content>
    </Panel.Wrapper>
  )
}
