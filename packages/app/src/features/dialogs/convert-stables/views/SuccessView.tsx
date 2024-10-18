import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import { SuccessViewTokenRow } from '../../common/components/success-view/SuccessViewTokenRow'

export interface SuccessViewProps {
  from: Token
  to: Token
  amount: NormalizedUnitNumber
  onProceed: () => void
  proceedText: string
}
export function SuccessView({ from, to, amount, onProceed, proceedText }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <Panel.Wrapper className="mt-8 flex w-full flex-col gap-4 bg-panel-bg p-4">
        <div className="flex flex-col gap-2.5" data-testid={testIds.dialog.success}>
          <DialogPanelTitle>Converted from</DialogPanelTitle>
          <SuccessViewTokenRow token={from} amount={amount} />
          <div className="w-full border-b" />
          <DialogPanelTitle>To</DialogPanelTitle>
          <SuccessViewTokenRow token={to} amount={amount} />
        </div>
      </Panel.Wrapper>
      <SuccessViewProceedButton onProceed={onProceed}>{proceedText}</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
