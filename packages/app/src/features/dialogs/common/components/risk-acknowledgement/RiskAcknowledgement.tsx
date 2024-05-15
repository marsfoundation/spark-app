import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { testIds } from '@/ui/utils/testIds'

import { Alert } from '../alert/Alert'

export type RiskWarning = {
  type: 'savings-discrepancy-threshold-hit'
  discrepancy: NormalizedUnitNumber
  token: Token
}
export interface RiskAcknowledgementProps {
  warning: RiskWarning
  onStatusChange: (acknowledged: boolean) => void
}

export function RiskAcknowledgement({ warning, onStatusChange }: RiskAcknowledgementProps) {
  return (
    <div className="flex flex-col gap-2">
      <Alert variant="danger">
        <div className="text-basics-black text-sm">
          Swap value might be significantly lower than expected. Difference is{' '}
          {warning.token.format(warning.discrepancy, { style: 'auto' })} {warning.token.symbol}.
        </div>
      </Alert>
      <LabeledSwitch onCheckedChange={onStatusChange} data-testid={testIds.dialog.acknowledgeRiskSwitch}>
        <div className="text-basics-black text-sm font-semibold">I acknowledge risks involved</div>
      </LabeledSwitch>
    </div>
  )
}
