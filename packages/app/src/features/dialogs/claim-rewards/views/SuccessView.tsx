import { Reward } from '@/features/navbar/components/rewards-badge/types'
import { SuccessViewCheckmark } from '../../common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../../common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '../../common/components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '../../common/components/success-view/SuccessViewSummaryPanel'
import { RewardsList } from '../components/RewardsList'

export interface SuccessViewProps {
  claimedRewards: Reward[]
  onClose: () => void
}
export function SuccessView({ claimedRewards, onClose }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewSummaryPanel>
        <div className="flex w-full flex-col">
          <div className="mb-2 font-semibold text-primary text-xs"> Claimed </div>
          <RewardsList rewards={claimedRewards} />
        </div>
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onClose}>Close</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
