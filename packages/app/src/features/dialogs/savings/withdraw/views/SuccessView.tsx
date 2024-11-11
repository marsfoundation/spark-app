import { TokenWithValue } from '@/domain/common/types'
import { SuccessViewPanelTitle } from '@/features/dialogs/common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewPanel } from '@/features/dialogs/common/components/success-view/SuccessViewPanel'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import { SuccessViewTokenRow } from '@/features/dialogs/common/components/success-view/SuccessViewTokenRow'
import { BlockExplorerAddressLink } from '@/ui/molecules/block-explorer-address-link/BlockExplorerAddressLink'
import { testIds } from '@/ui/utils/testIds'
import { SendModeExtension } from '../types'
export interface SuccessViewProps {
  tokenToWithdraw: TokenWithValue
  closeDialog: () => void
  sendModeExtension?: Pick<SendModeExtension, 'receiver'>
}
export function SuccessView({ tokenToWithdraw, closeDialog, sendModeExtension }: SuccessViewProps) {
  const { token, value } = tokenToWithdraw
  const panelTitle = sendModeExtension ? 'Sent' : 'Withdrew'

  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewPanel data-testid={testIds.dialog.success}>
        <SuccessViewPanelTitle>{panelTitle}</SuccessViewPanelTitle>
        <SuccessViewTokenRow token={token} amount={value} />
        {sendModeExtension?.receiver && (
          <>
            <SuccessViewPanelTitle>Recipient</SuccessViewPanelTitle>
            <BlockExplorerAddressLink
              address={sendModeExtension.receiver}
              className="typography-label-4 text-primary"
            />
          </>
        )}
      </SuccessViewPanel>
      <SuccessViewProceedButton onProceed={closeDialog}>Back to Savings</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
