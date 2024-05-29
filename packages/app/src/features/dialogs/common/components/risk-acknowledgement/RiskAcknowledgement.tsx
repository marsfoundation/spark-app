import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { testIds } from '@/ui/utils/testIds'

import { Alert } from '../alert/Alert'

export type RiskWarning =
  | {
      type: 'savings-deposit-discrepancy-threshold-hit'
      discrepancy: NormalizedUnitNumber
      token: Token
    }
  | {
      type: 'savings-withdraw-discrepancy-threshold-hit'
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
          {warning.type === 'savings-deposit-discrepancy-threshold-hit' &&
            `Market fluctuations can impact your transaction value. The final amount received may be less than the deposit amount by up to ${warning.token.format(
              warning.discrepancy,
              { style: 'auto' },
            )} ${warning.token.symbol}.`}
          {warning.type === 'savings-withdraw-discrepancy-threshold-hit' &&
            `Market fluctuations can impact your transaction value. You may be charged more than the withdraw amount by up to ${warning.token.format(
              warning.discrepancy,
              { style: 'auto' },
            )} ${warning.token.symbol}.`}
        </div>
      </Alert>
      <LabeledSwitch onCheckedChange={onStatusChange} data-testid={testIds.dialog.acknowledgeRiskSwitch}>
        <div className="font-semibold text-basics-black text-sm">I acknowledge risks involved</div>
      </LabeledSwitch>
    </div>
  )
}
