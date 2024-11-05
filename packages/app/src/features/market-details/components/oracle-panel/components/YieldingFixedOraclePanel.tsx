import { YieldingFixedOracleInfo } from '@/domain/oracles/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Panel } from '@/ui/atoms/panel/Panel'
import { BlockExplorerAddressLink } from '@/ui/molecules/block-explorer-address-link/BlockExplorerAddressLink'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { testIds } from '@/ui/utils/testIds'
import { ProvidersList } from './ProvidersList'

const oracleTestIds = testIds.marketDetails.oraclePanel

export function YieldingFixedOraclePanel({
  providedBy,
  chainId,
  token,
  price,
  priceOracleAddress,
  ratio,
  baseAssetOracle,
  baseAssetSymbol,
  baseAssetPrice,
}: YieldingFixedOracleInfo) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <div>
        <div className="mb-1 text-sm text-white/50 leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">
            Yielding Fixed Price{' '}
            {providedBy.length > 1 && <span className="font-medium text-white/30">(Redundant)</span>}
          </Panel.Title>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="grid items-center gap-4 md:grid-cols-[1fr,14px,1fr,14px,1fr] md:gap-3 md:pb-6">
          <div className="relative flex flex-col items-center gap-2">
            <div
              className="w-full rounded-2xl border border-basics-grey/30 bg-white/10 p-2 text-center text-xl"
              data-testid={oracleTestIds.yieldingFixed.ratio}
            >
              {ratio.toFixed(4)}
            </div>
            <div className="md:-bottom-6 text-white/50 text-xs md:absolute">
              <span data-testid={oracleTestIds.asset}>{token.symbol}</span> to {baseAssetSymbol} Ratio
            </div>
          </div>
          <img src={assets.multiply} alt="multiply sign" className="w-3.5 place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div
              className="w-full rounded-2xl border border-basics-grey/30 bg-white/10 p-2 text-center text-xl"
              data-testid={oracleTestIds.yieldingFixed.baseAssetPrice}
            >
              {formatUSDPriceWithPrecision(baseAssetPrice)}
            </div>
            <div className="md:-bottom-6 text-white/50 text-xs md:absolute">
              <span data-testid={oracleTestIds.yieldingFixed.baseAssetSymbol}>{baseAssetSymbol}</span> Oracle Price
            </div>
          </div>
          <img src={assets.equal} alt="equal sign" className="w-3.5 place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div
              className="w-full rounded-2xl border border-basics-grey/30 bg-white/10 p-3 text-center text-xl"
              data-testid={oracleTestIds.price}
            >
              {formatUSDPriceWithPrecision(price)}
            </div>
            <div className="md:-bottom-6 text-white/50 text-xs md:absolute">Final Price</div>
          </div>
        </div>

        <div className="grid gap-9 sm:grid-cols-3">
          <InfoTile>
            <InfoTile.Label>Ratio Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink
                address={token.address}
                chainId={chainId}
                data-testid={oracleTestIds.yieldingFixed.ratioContract}
              />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Oracle Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink
                address={baseAssetOracle}
                chainId={chainId}
                data-testid={oracleTestIds.yieldingFixed.baseAssetOracleContract}
              />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Price Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink
                address={priceOracleAddress}
                chainId={chainId}
                data-testid={oracleTestIds.oracleContract}
              />
            </InfoTile.Value>
          </InfoTile>
        </div>
        <ProvidersList providers={providedBy} />
      </Panel.Content>
    </Panel.Wrapper>
  )
}

function formatUSDPriceWithPrecision(usdPrice: NormalizedUnitNumber): string {
  const number = usdPrice.toNumber()

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    // When the price is less than 2 USD, display 4 decimal places otherwise display standard 2 decimals
    maximumFractionDigits: number >= 2 ? 2 : 4,
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(number)
}
