import { RiskWarning } from '@/domain/liquidation-risk-warning/types'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { testIds } from '@/ui/utils/testIds'
import { Alert } from '../../../features/dialogs/common/components/alert/Alert'

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
          {warning.type === 'liquidation-warning-borrow' &&
            'Borrowing this amount puts you at risk of quick liquidation and losing your collateral.'}
          {warning.type === 'liquidation-warning-withdraw' &&
            'Withdrawing this amount of collateral puts you at risk of quick liquidation and losing your collateral.'}
          {warning.type === 'liquidation-warning-set-collateral' &&
            'Disabling this asset as collateral puts you at risk of quick liquidation and losing your remaining collateral.'}
          {warning.type === 'liquidation-warning-e-mode-off' &&
            'Disabling E-Mode decreases health factor of your position and puts you at risk of quick liquidation and losing your collateral.'}
        </div>
      </Alert>
      <LabeledSwitch onCheckedChange={onStatusChange} data-testid={testIds.dialog.acknowledgeRiskSwitch}>
        <div className="font-semibold text-basics-black text-sm">I acknowledge risks involved</div>
      </LabeledSwitch>
    </div>
  )
}
