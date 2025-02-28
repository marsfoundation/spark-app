import { formatPercentage } from '@/domain/common/format'
import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Link } from '@/ui/atoms/link/Link'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { testIds } from '@/ui/utils/testIds'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { AccountSparkRewardsSummary } from '../../types'
import { AdditionalInfo } from './AdditionalInfo'

export interface SidePanelGroupProps {
  underlyingToken: Token
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  oneYearProjection: NormalizedUnitNumber
  apy: Percentage
  apyExplainer: string
  apyExplainerDocsLink: string
  sparkRewardsSummary: AccountSparkRewardsSummary
  className?: string
}
export function SidePanelGroup({
  underlyingToken,
  savingsToken,
  savingsTokenBalance,
  oneYearProjection,
  apy,
  apyExplainer,
  apyExplainerDocsLink,
  sparkRewardsSummary,
  className,
}: SidePanelGroupProps) {
  return (
    <div className={className}>
      <div className="grid h-full grid-rows-3 gap-2">
        <SidePanel>
          <AdditionalInfo.Label
            tooltipContent={
              <>
                {apyExplainer}{' '}
                <Link to={apyExplainerDocsLink} external>
                  Learn more
                </Link>
              </>
            }
          >
            APY
          </AdditionalInfo.Label>
          <AdditionalInfo.Content>
            <div
              className="typography-heading-5 flex items-center gap-1 text-primary-inverse"
              data-testid={testIds.savings.account.mainPanel.apy}
            >
              {formatPercentage(apy, { minimumFractionDigits: 0 })}
              {sparkRewardsSummary.totalApy.gt(0) && (
                <>
                  <span>+</span>
                  <img src={assets.page.sparkRewardsCircle} alt={'Spark Rewards'} className="size-6" />
                  <span className="bg-gradient-spark-rewards-1 bg-clip-text text-transparent">
                    {formatPercentage(sparkRewardsSummary.totalApy, { minimumFractionDigits: 0 })}
                  </span>
                </>
              )}
            </div>
          </AdditionalInfo.Content>
        </SidePanel>
        <SidePanel>
          <AdditionalInfo.Label tooltipContent="This is an estimate of what you could earn in 1 year.">
            1-year Projection
          </AdditionalInfo.Label>
          <AdditionalInfo.Content>
            <div
              className="flex items-center gap-1.5"
              data-testid={testIds.savings.account.mainPanel.oneYearProjection}
            >
              <div className="typography-heading-5 flex gap-[1px]">
                <div className="text-feature-savings-primary">+</div>
                <div className="text-primary-inverse">
                  {underlyingToken.format(oneYearProjection, { style: 'auto' })}
                </div>
              </div>
              <TokenIcon token={underlyingToken} className="size-5" />
            </div>
          </AdditionalInfo.Content>
        </SidePanel>
        <SidePanel>
          <AdditionalInfo.Label> Your {savingsToken.symbol} Balance </AdditionalInfo.Label>
          <AdditionalInfo.Content>
            <div
              className="typography-heading-5 flex items-center gap-1.5"
              data-testid={testIds.savings.account.savingsToken.balance}
            >
              {savingsToken.format(savingsTokenBalance, { style: 'auto' })}
              <TokenIcon token={savingsToken} className="size-5" />
            </div>
          </AdditionalInfo.Content>
        </SidePanel>
      </div>
    </div>
  )
}

function SidePanel({ children }: { children: React.ReactNode }) {
  return (
    <Panel variant="secondary" spacing="s" className="flex w-[325px] flex-col justify-center gap-2 md:px-8 md:py-0">
      {children}
    </Panel>
  )
}
