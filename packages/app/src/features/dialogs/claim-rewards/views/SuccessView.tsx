import { Reward } from '@/features/topbar/types'
import { testIds } from '@/ui/utils/testIds'
import { SuccessViewPanelTitle } from '../../common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '../../common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../../common/components/success-view/SuccessViewContent'
import { SuccessViewPanel } from '../../common/components/success-view/SuccessViewPanel'
import { SuccessViewProceedButton } from '../../common/components/success-view/SuccessViewProceedButton'
import { SuccessViewTokenRow } from '../../common/components/success-view/SuccessViewTokenRow'

export interface SuccessViewProps {
  claimedRewards: Reward[]
  onClose: () => void
}
export function SuccessView({ claimedRewards, onClose }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewPanel>
        <SuccessViewPanelTitle>Claimed</SuccessViewPanelTitle>
        {claimedRewards.map(({ token, amount }, index) => (
          <SuccessViewTokenRow
            key={token.symbol}
            token={token}
            amount={amount}
            data-testid={testIds.component.SuccessView.row(index)}
          />
        ))}
      </SuccessViewPanel>
      <SuccessViewProceedButton onProceed={onClose}>Close</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
