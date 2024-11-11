import { TokenWithValue } from '@/domain/common/types'
import { SuccessViewPanelTitle } from '@/features/dialogs/common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewPanel } from '@/features/dialogs/common/components/success-view/SuccessViewPanel'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import { SuccessViewTokenRow } from '@/features/dialogs/common/components/success-view/SuccessViewTokenRow'
import { testIds } from '@/ui/utils/testIds'

export interface SuccessViewProps {
  outcome: TokenWithValue
  reward: TokenWithValue
  closeDialog: () => void
  isExiting: boolean
}
export function SuccessView({ outcome, reward, closeDialog, isExiting }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewPanel data-testid={testIds.dialog.success}>
        <SuccessViewPanelTitle>Withdrew</SuccessViewPanelTitle>
        <SuccessViewTokenRow token={outcome.token} amount={outcome.value} />
        {isExiting && (
          <>
            <SuccessViewPanelTitle>Claimed</SuccessViewPanelTitle>
            <SuccessViewTokenRow token={reward.token} amount={reward.value} />
          </>
        )}
      </SuccessViewPanel>
      <SuccessViewProceedButton onProceed={closeDialog}>Back to Farm</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
