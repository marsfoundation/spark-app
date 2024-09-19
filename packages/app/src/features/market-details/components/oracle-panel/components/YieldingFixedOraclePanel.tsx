import { ReserveOracleType } from '@/config/chain/types'
import { assets } from '@/ui/assets'
import { Panel } from '@/ui/atoms/panel/Panel'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Info } from '@/ui/molecules/info/Info'
import { zeroAddress } from 'viem'
import { BlockExplorerAddressLink } from './BlockExplorerAddressLink'
import { ProvidersList } from './ProvidersList'

interface YieldingFixedOraclePanelProps {
  oracle: Extract<ReserveOracleType, { type: 'yielding-fixed' }>
  chainId: number
}

export function YieldingFixedOraclePanel({ oracle, chainId }: YieldingFixedOraclePanelProps) {
  return (
    <Panel.Wrapper className="flex flex-col gap-4 p-4 sm:px-8 sm:py-6">
      <div>
        <div className="mb-1 text-basics-dark-grey text-sm leading-none sm:text-xs sm:leading-none">Oracle type</div>
        <Panel.Header className="flex items-center gap-2">
          <Panel.Title className="text-xl">
            Yielding Fixed Price{' '}
            {oracle.providedBy.length > 1 && <span className="font-medium text-basics-dark-grey">(Redundant)</span>}
          </Panel.Title>
          <Info size={16}>Some info</Info>
        </Panel.Header>
      </div>
      <Panel.Content className="flex flex-col gap-4 sm:gap-6">
        <div className="grid items-center gap-4 md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-3 md:pb-6">
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              1.00035
            </div>
            <div className=" md:-bottom-6 text-basics-dark-grey text-xs md:absolute">weETH to ETH Ratio</div>
          </div>
          <img src={assets.multiply} alt="multiply sign" className="place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              $3,574.58
            </div>
            <div className=" md:-bottom-6 text-basics-dark-grey text-xs md:absolute">ETH Oracle Price</div>
          </div>
          <img src={assets.equal} alt="equal sign" className="place-self-center" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-full rounded-2xl border border-basics-grey/30 bg-basics-light-grey p-2 text-center text-xl">
              $3,674.58
            </div>
            <div className=" md:-bottom-6 text-basics-dark-grey text-xs md:absolute">Final Price</div>
          </div>
        </div>

        <div className="grid gap-9 sm:grid-cols-3">
          <InfoTile>
            <InfoTile.Label>Ratio Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={zeroAddress} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Token Contract</InfoTile.Label>
            <InfoTile.Value>
              <BlockExplorerAddressLink address={zeroAddress} chainId={chainId} />
            </InfoTile.Value>
          </InfoTile>

          <InfoTile>
            <InfoTile.Label>Price Contract</InfoTile.Label>
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
