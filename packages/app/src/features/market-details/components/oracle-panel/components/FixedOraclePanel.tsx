import { ReserveOracleType } from '@/config/chain/types'
import { OracleInfo } from '@/domain/oracles/types'
import { Panel } from '@/ui/atoms/panel/Panel'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { BlockExplorerAddressLink } from './BlockExplorerAddressLink'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'

interface FixedOraclePanelProps extends OracleInfo {
  oracle: Extract<ReserveOracleType, { type: 'fixed' }>
}

export function FixedOraclePanel({ chainId, price, priceOracleAddress, token }: FixedOraclePanelProps) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <div>
        <div className="mb-1 text-basics-dark-grey text-sm leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">Fixed Price</Panel.Title>
          <Info size={16}>Uses a fixed price for the asset, that does not deviate based on the market price.</Info>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <InfoTile>
            <InfoTile.Label>Price</InfoTile.Label>
            <InfoTile.Value>{USD_MOCK_TOKEN.formatUSD(price)}</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Asset</InfoTile.Label>
            <InfoTile.Value>{token.symbol}</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={priceOracleAddress} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>
        </div>
      </Panel.Content>
    </Panel.Wrapper>
  )
}
