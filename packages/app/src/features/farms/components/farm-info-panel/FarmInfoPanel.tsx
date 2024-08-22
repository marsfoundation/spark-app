import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token, USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { AssetsGroup } from '../../types'

export interface FarmInfoPanelProps {
  apy: Percentage
  assetsGroupType: AssetsGroup['type']
  rewardToken: Token
  depositors: number
  tvl: NormalizedUnitNumber
}

export function FarmInfoPanel({ apy, assetsGroupType, rewardToken, depositors, tvl }: FarmInfoPanelProps) {
  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex max-w-[75%] flex-col gap-4">
        <h2 className="font-semibold text-2xl text-sky-950 md:text-3xl">
          Stake {assetsGroupToText(assetsGroupType)} <br />
          and earn <span className="text-[#3F66EF]">{formatPercentage(apy, { minimumFractionDigits: 0 })}</span> APY
        </h2>
        <div className="text-basics-dark-grey">
          Deposit the {assetsGroupToText(assetsGroupType)} from those available below and start farming{' '}
          {rewardToken.symbol} token.
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-12">
          <DetailsItem title="Addresses" explainer="Number of addresses that have deposited in the farm">
            <div className="font-semibold">{depositors}</div>
          </DetailsItem>
          <DetailsItem title="TVL" explainer="Total value locked in the farm">
            <div className="font-semibold">{USD_MOCK_TOKEN.formatUSD(tvl)}</div>
          </DetailsItem>
          <DetailsItem title="APY" explainer="Annual percentage yield">
            <div className="font-semibold text-[#3F66EF]">{formatPercentage(apy, { minimumFractionDigits: 0 })}</div>
          </DetailsItem>
        </div>
        <div className="hidden border-basics-border border-t md:block" />
        <Button className="w-full">Stake</Button>
      </div>
    </Panel.Wrapper>
  )
}

function assetsGroupToText(assetsGroupType: AssetsGroup['type']): string {
  switch (assetsGroupType) {
    case 'stablecoins':
      return 'stablecoins'
    case 'governance':
      return 'governance tokens'
  }
}

export interface DetailsItemProps {
  title: string
  explainer: string
  children: React.ReactNode
}
function DetailsItem({ title, explainer, children }: DetailsItemProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-1 md:w-fit md:flex-col md:items-start md:justify-normal">
      <div className="flex flex-row items-center gap-1 text-prompt-foreground text-xs">
        {title}
        <Info>{explainer}</Info>
      </div>
      <div>{children}</div>
    </div>
  )
}
