import { RiskWarning } from '@/domain/liquidation-risk-warning/types'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { Alert } from '@/ui/molecules/new/alert/Alert'
import { testIds } from '@/ui/utils/testIds'

export interface RiskAcknowledgementProps {
  warning: RiskWarning
  onStatusChange: (acknowledged: boolean) => void
}

export function RiskAcknowledgement({ warning, onStatusChange }: RiskAcknowledgementProps) {
  return (
    <div className="flex flex-col gap-2">
      <Alert variant="error">
        <div data-testid={testIds.component.RiskAcknowledgement.explanation}>
          {warning.type === 'liquidation-warning-borrow' &&
            'Borrowing this amount puts you at risk of quick liquidation. You may lose part of your collateral.'}
          {warning.type === 'liquidation-warning-withdraw' &&
            'Withdrawing this amount puts you at risk of quick liquidation. You may lose part of your collateral.'}
          {warning.type === 'liquidation-warning-set-collateral' &&
            'Disabling this asset as collateral puts you at risk of quick liquidation. You may lose part of your remaining collateral.'}
          {warning.type === 'liquidation-warning-e-mode-off' &&
            'Disabling E-Mode decreases health factor of your position and puts you at risk of quick liquidation. You may lose part of your collateral.'}
        </div>
      </Alert>
      <LabeledSwitch onCheckedChange={onStatusChange} data-testid={testIds.component.RiskAcknowledgement.switch}>
        <div className="font-semibold text-basics-black text-sm">I acknowledge risks involved</div>
      </LabeledSwitch>
    </div>
  )
}
