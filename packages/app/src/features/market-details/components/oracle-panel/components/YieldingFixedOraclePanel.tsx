import { ReserveOracleType } from '@/config/chain/types'
import { OracleInfo } from '@/domain/oracles/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Panel } from '@/ui/atoms/panel/Panel'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { BlockExplorerAddressLink } from './BlockExplorerAddressLink'
import { ProvidersList } from './ProvidersList'

interface YieldingFixedOraclePanelProps extends Required<OracleInfo> {
  oracle: Extract<ReserveOracleType, { type: 'yielding-fixed' }>
  chainId: number
}

export function YieldingFixedOraclePanel({
  oracle,
  chainId,
  token,
  price,
  priceOracleAddress,
  baseTokenReserve,
  ratio,
}: YieldingFixedOraclePanelProps) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <div>
        <div className="mb-1 text-basics-dark-grey text-sm leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">
            Yielding Fixed Price{' '}
            {oracle.providedBy.length > 1 && <span className="font-medium text-basics-dark-grey">(Redundant)</span>}
          </Panel.Title>
          <Info size={16}>Uses an exchange ratio together with with a market price of a base asset</Info>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="grid items-center gap-4 md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-3 md:pb-6">
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              {ratio.toFixed(4)}
            </div>
            <div className="md:-bottom-6 text-basics-dark-grey text-xs md:absolute">
              {token.symbol} to {oracle.baseAsset} Ratio
            </div>
          </div>
          <img src={assets.multiply} alt="multiply sign" className="place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              {USD_MOCK_TOKEN.formatUSD(baseTokenReserve.token.unitPriceUsd)}
            </div>
            <div className="md:-bottom-6 text-basics-dark-grey text-xs md:absolute">
              {oracle.baseAsset} Oracle Price
            </div>
          </div>
          <img src={assets.equal} alt="equal sign" className="place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-3 text-center text-xl">
              {USD_MOCK_TOKEN.formatUSD(price)}
            </div>
            <div className="md:-bottom-6 text-basics-dark-grey text-xs md:absolute">Final Price</div>
          </div>
        </div>

        <div className="grid gap-9 sm:grid-cols-3">
          <InfoTile>
            <InfoTile.Label>Ratio Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={token.address} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Oracle Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={baseTokenReserve.priceOracle} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Price Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={priceOracleAddress} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>
        </div>
        <ProvidersList providers={oracle.providedBy} />
      </Panel.Content>
    </Panel.Wrapper>
  )
}
