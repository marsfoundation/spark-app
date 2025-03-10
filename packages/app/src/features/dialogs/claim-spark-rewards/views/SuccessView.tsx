import { getChainConfigEntry } from '@/config/chain'
import { SuccessViewPanelTitle } from '../../common/components/success-view/SuccessPanelTitle'
import { SuccessViewCheckmark } from '../../common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../../common/components/success-view/SuccessViewContent'
import { SuccessViewPanel } from '../../common/components/success-view/SuccessViewPanel'
import { SuccessViewProceedButton } from '../../common/components/success-view/SuccessViewProceedButton'
import { SuccessViewTokenRow } from '../../common/components/success-view/SuccessViewTokenRow'
import { SparkReward } from '../types'

export interface SuccessViewProps {
  claimedRewards: SparkReward[]
  chainId: number
  onClose: () => void
}
export function SuccessView({ claimedRewards, chainId, onClose }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewPanel>
        <SuccessViewPanelTitle>Claimed</SuccessViewPanelTitle>
        {claimedRewards.map(({ token, amountToClaim }) => (
          <SuccessViewTokenRow key={token.symbol} token={token} amount={amountToClaim} />
        ))}
        <SuccessViewPanelTitle>Network</SuccessViewPanelTitle>
        <div className="typography-label-2 flex items-center gap-1.5 text-primary">
          <img src={getChainConfigEntry(chainId).meta.logo} alt="network logo" className="size-5" />
          {getChainConfigEntry(chainId).meta.name}
        </div>
      </SuccessViewPanel>
      <SuccessViewProceedButton onProceed={onClose}>Close</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
