import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'
import { SuccessViewPanelTitle } from '../../common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '../../common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../../common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '../../common/components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '../../common/components/success-view/SuccessViewSummaryPanel'
import { SparkReward } from '../types'

export interface SuccessViewProps {
  claimedRewards: SparkReward[]
  onClose: () => void
}
export function SuccessView({ claimedRewards, onClose }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewSummaryPanel>
        <SuccessViewPanelTitle>Claimed</SuccessViewPanelTitle>
        <div className="flex flex-col items-stretch">
          {claimedRewards.map(({ token, amountToClaim }) => (
            <div
              key={token.symbol}
              className="typography-label-2 flex items-center justify-between border-b py-4 text-primary last:border-none"
            >
              <TokenAmount token={token} amount={amountToClaim} variant="horizontal" />
            </div>
          ))}
        </div>
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onClose}>Close</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
