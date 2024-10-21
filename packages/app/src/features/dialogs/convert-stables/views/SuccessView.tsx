import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { SuccessViewTokenRow } from '../../common/components/success-view/SuccessViewTokenRow'
import { TxOverview } from '../logic/createTxOverview'

export interface SuccessViewProps {
  txOverview: TxOverview
  onProceed: () => void
  proceedText: string
}
export function SuccessView({ txOverview, onProceed, proceedText }: SuccessViewProps) {
  assert(txOverview.status === 'success', 'txOverview should be success when on success view')
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <Panel.Wrapper className="mt-8 flex w-full flex-col gap-4 bg-panel-bg p-4">
        <div className="flex flex-col gap-2.5" data-testid={testIds.dialog.success}>
          <DialogPanelTitle>Converted from</DialogPanelTitle>
          <SuccessViewTokenRow token={txOverview.inToken} amount={txOverview.outcome.value} />
          <div className="w-full border-b" />
          <DialogPanelTitle>To</DialogPanelTitle>
          <SuccessViewTokenRow token={txOverview.outcome.token} amount={txOverview.outcome.value} />
        </div>
      </Panel.Wrapper>
      <SuccessViewProceedButton onProceed={onProceed}>{proceedText}</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
