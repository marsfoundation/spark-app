import { UnderlyingAssetOracleInfo } from '@/domain/oracles/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { BlockExplorerAddressLink } from '@/ui/molecules/block-explorer-address-link/BlockExplorerAddressLink'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { testIds } from '@/ui/utils/testIds'

export function UnderlyingAssetOraclePanel({ asset, chainId, priceOracleAddress, price }: UnderlyingAssetOracleInfo) {
  return (
    <Panel className="flex flex-col gap-4">
      <div>
        <div className="typography-label-6 mb-1 text-secondary">Oracle type</div>
        <div className="flex items-center gap-2">
          <div className="typography-heading-5 text-primary">Underlying Asset Price</div>
          <Info size={16}>
            The asset price is derived from a market price oracle tracking the value of the underlying asset. Sky
            Governance controls which oracle is used.
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
            <InfoTile.Value data-testid={testIds.marketDetails.oraclePanel.asset}>{asset}</InfoTile.Value>
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
      </div>
    </Panel>
  )
}
