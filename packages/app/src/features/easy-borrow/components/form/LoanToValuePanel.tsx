import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import { nonZeroOrDefault } from '@/utils/bigNumber'
import { LoanToValueSlider } from './LoanToValueSlider'

interface LoanToValuePanelProps {
  ltv: Percentage
  maxLtv: Percentage
  liquidationLtv: Percentage
  disabled?: boolean
  onLtvChange: (value: Percentage) => void
}
export function LoanToValuePanel({ ltv, maxLtv, liquidationLtv, disabled, onLtvChange }: LoanToValuePanelProps) {
  return (
    <Panel className="p-[32px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="typography-label-2 flex flex-row justify-between text-primary">
            <h4>Loan to Value (LTV)</h4>
            <h4 data-testid={testIds.easyBorrow.form.ltv}>{formatPercentage(ltv)}</h4>
          </div>

          <div className="typography-label-5 mt-2 flex flex-row justify-between text-secondary">
            <div>Ratio of the collateral value to the borrowed value</div>
            <div>max. {formatPercentage(maxLtv)}</div>
          </div>
        </div>

        <LoanToValueSlider
          ltv={ltv}
          liquidationLtv={nonZeroOrDefault(liquidationLtv, Percentage(0.8))}
          maxAvailableLtv={nonZeroOrDefault(maxLtv, Percentage(0.825))}
          onLtvChange={onLtvChange}
          disabled={disabled}
        />
      </div>
    </Panel>
  )
}
