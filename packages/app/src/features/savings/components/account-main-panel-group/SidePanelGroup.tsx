import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { testIds } from '@/ui/utils/testIds'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { Projections } from '../../types'
import { AdditionalInfo } from './AdditionalInfo'

export interface SidePanelGroupProps {
  underlyingToken: Token
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  projections: Projections
  className?: string
}
export function SidePanelGroup({
  underlyingToken,
  savingsToken,
  savingsTokenBalance,
  projections,
  className,
}: SidePanelGroupProps) {
  return (
    <div className={className}>
      <div className="grid grid-rows-3 gap-2">
        <SidePanel>
          <AdditionalInfo.Label tooltipText="This is an estimate of what you could earn in 30 days.">
            30-days Projection
          </AdditionalInfo.Label>
          <AdditionalInfo.Content>
            <Projection
              token={underlyingToken}
              value={projections.thirtyDays}
              data-testid={testIds.savings.account.mainPanel.projections.thirtyDays}
            />
          </AdditionalInfo.Content>
        </SidePanel>
        <SidePanel>
          <AdditionalInfo.Label tooltipText="This is an estimate of what you could earn in 1 year.">
            1-year Projection
          </AdditionalInfo.Label>
          <AdditionalInfo.Content>
            <Projection
              token={underlyingToken}
              value={projections.oneYear}
              data-testid={testIds.savings.account.mainPanel.projections.oneYear}
            />
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
    <Panel variant="secondary" className="flex w-[325px] flex-col gap-2 py-7">
      {children}
    </Panel>
  )
}

function Projection({
  token,
  value,
  'data-testid': dataTestId,
}: {
  token: Token
  value: NormalizedUnitNumber
  'data-testid'?: string
}) {
  return (
    <div className="flex items-center gap-1.5" data-testid={dataTestId}>
      <div className="typography-heading-5 flex gap-[1px]">
        <div className="text-feature-savings-primary">+</div>
        <div className="text-primary-inverse">{token.format(value, { style: 'auto' })}</div>
      </div>
      <TokenIcon token={token} className="size-5" />
    </div>
  )
}
