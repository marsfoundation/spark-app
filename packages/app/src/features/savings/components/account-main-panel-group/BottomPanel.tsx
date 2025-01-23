import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { Projections } from '../../types'
import { AdditionalInfo } from './AdditionalInfo'

export interface BottomPanelProps {
  underlyingToken: Token
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  projections: Projections
  className?: string
}

export function BottomPanel({
  underlyingToken,
  savingsToken,
  savingsTokenBalance,
  projections,
  className,
}: BottomPanelProps) {
  return (
    <Panel variant="secondary" className={cn('flex flex-col gap-3', className)}>
      <BottomPanelItem>
        <AdditionalInfo.Label tooltipText="This is an estimate of what you could earn in 30 days.">
          30-day projection
        </AdditionalInfo.Label>
        <AdditionalInfo.Content>
          <Projection token={underlyingToken} value={projections.thirtyDays} />
        </AdditionalInfo.Content>
      </BottomPanelItem>
      <BottomPanelItem>
        <AdditionalInfo.Label tooltipText="This is an estimate of what you could earn in 1 year.">
          1-year projection
        </AdditionalInfo.Label>
        <AdditionalInfo.Content>
          <Projection token={underlyingToken} value={projections.thirtyDays} />
        </AdditionalInfo.Content>
      </BottomPanelItem>
      <BottomPanelItem>
        <AdditionalInfo.Label>Your {savingsToken.symbol} balance</AdditionalInfo.Label>
        <AdditionalInfo.Content>
          <div className="typography-label-2 flex items-center gap-1.5">
            {savingsToken.format(savingsTokenBalance, { style: 'auto' })}
            <TokenIcon token={savingsToken} className="size-4" />
          </div>
        </AdditionalInfo.Content>
      </BottomPanelItem>
    </Panel>
  )
}

function BottomPanelItem({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>
}

function Projection({ token, value }: { token: Token; value: NormalizedUnitNumber }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="typography-label-2 flex gap-[1px]">
        <div className="text-feature-savings-primary">+</div>
        <div className="text-primary-inverse">{token.format(value, { style: 'auto' })}</div>
      </div>
      <TokenIcon token={token} className="size-4" />
    </div>
  )
}
