import { MarketPriceOracleInfo } from '@/domain/oracles/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { InfoTile } from '@/features/market-details/components/info-tile/InfoTile'
import { Panel } from '@/ui/atoms/panel/Panel'
import { BlockExplorerAddressLink } from '@/ui/molecules/block-explorer-address-link/BlockExplorerAddressLink'
import { Info } from '@/ui/molecules/info/Info'
import { testIds } from '@/ui/utils/testIds'
import { ProvidersList } from './ProvidersList'

export function MarketOraclePanel({ providedBy, chainId, price, priceOracleAddress, token }: MarketPriceOracleInfo) {
  return (
    <Panel className="flex flex-col gap-4">
      <div>
        <div className="typography-label-4 mb-1 text-secondary">Oracle type</div>
        <div className="flex items-center gap-2">
          <h3 className="typography-label-1 text-primary">
            Market Price {providedBy.length > 1 && <span className="text-secondary">(Redundant)</span>}
          </h3>
          <Info size={16}>
            The asset price is tracked by an oracle that reflects the live market value. Sky Governance controls which
            oracle is used.
          </Info>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:gap-6">
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
      </div>
    </Panel>
  )
}
