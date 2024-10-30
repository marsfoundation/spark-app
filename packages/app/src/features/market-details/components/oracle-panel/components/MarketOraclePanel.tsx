import { MarketPriceOracleInfo } from '@/domain/oracles/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { BlockExplorerAddressLink } from '@/ui/molecules/block-explorer-address-link/BlockExplorerAddressLink'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { testIds } from '@/ui/utils/testIds'
import { ProvidersList } from './ProvidersList'

export function MarketOraclePanel({ providedBy, chainId, price, priceOracleAddress, token }: MarketPriceOracleInfo) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <div>
        <div className="mb-1 text-sm text-white/50 leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">
            Market Price {providedBy.length > 1 && <span className="font-medium text-white/30">(Redundant)</span>}
          </Panel.Title>

          <Info size={16}>
            The asset price is tracked by an oracle that reflects the live market value. Sky Governance controls which
            oracle is used.
          </Info>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <InfoTile>
            <InfoTile.Label>Price</InfoTile.Label>
            <InfoTile.Value data-testid={testIds.marketDetails.oraclePanel.price}>
              {USD_MOCK_TOKEN.formatUSD(price)}
            </InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Asset</InfoTile.Label>
            <InfoTile.Value data-testid={testIds.marketDetails.oraclePanel.asset}>{token.symbol}</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink
                address={priceOracleAddress}
                chainId={chainId}
                data-testid={testIds.marketDetails.oraclePanel.oracleContract}
              />
            </InfoTile.Value>
          </InfoTile>
        </div>
        <ProvidersList providers={providedBy} />
      </Panel.Content>
    </Panel.Wrapper>
  )
}
