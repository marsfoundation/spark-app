import { YieldingFixedOracleInfo } from '@/domain/oracles/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Panel } from '@/ui/atoms/panel/Panel'
import { BlockExplorerAddressLink } from '@/ui/molecules/block-explorer-address-link/BlockExplorerAddressLink'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { ProvidersList } from './ProvidersList'

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
        <div className="mb-1 text-basics-dark-grey text-sm leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">
            Yielding Fixed Price{' '}
            {providedBy.length > 1 && <span className="font-medium text-basics-dark-grey">(Redundant)</span>}
          </Panel.Title>
          <Info size={16}>
            The asset price is calculated using both an exchange rate and a market price oracle. Sky Governance controls
            which oracle is used.
          </Info>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="grid items-center gap-4 md:grid-cols-[1fr,14px,1fr,14px,1fr] md:gap-3 md:pb-6">
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              {ratio.toFixed(4)}
            </div>
            <div className="md:-bottom-6 text-basics-dark-grey text-xs md:absolute">
              {token.symbol} to {baseAssetSymbol} Ratio
            </div>
          </div>
          <img src={assets.multiply} alt="multiply sign" className="w-3.5 place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              {formatUSDWithPrecision(baseAssetPrice)}
            </div>
            <div className="md:-bottom-6 text-basics-dark-grey text-xs md:absolute">{baseAssetSymbol} Oracle Price</div>
          </div>
          <img src={assets.equal} alt="equal sign" className="w-3.5 place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-3 text-center text-xl">
              {formatUSDWithPrecision(price)}
            </div>
            <div className="md:-bottom-6 text-basics-dark-grey text-xs md:absolute">Final Price</div>
          </div>
        </div>

        <div className="grid gap-9 sm:grid-cols-3">
          <InfoTile>
            <InfoTile.Label>Ratio Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink address={token.address} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Oracle Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink address={baseAssetOracle} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Price Contract</InfoTile.Label>
            <InfoTile.Value className="w-full">
              <BlockExplorerAddressLink address={priceOracleAddress} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>
        </div>
        <ProvidersList providers={providedBy} />
      </Panel.Content>
    </Panel.Wrapper>
  )
}

function formatUSDWithPrecision(value: NormalizedUnitNumber): string {
  const number = value.toNumber()

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: number > 1 ? 2 : 5,
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(number)
}
