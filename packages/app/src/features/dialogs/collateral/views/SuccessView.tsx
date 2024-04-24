import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { SuccessViewCheckmark } from '../../common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../../common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '../../common/components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '../../common/components/success-view/SuccessViewSummaryPanel'
import { CollateralSetting } from '../types'

export interface SuccessViewProps {
  collateralSetting: CollateralSetting
  token: Token
  onProceed: () => void
}
export function SuccessView({ collateralSetting, token, onProceed }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewSummaryPanel>
        <div className="flex items-center gap-2">
          <TokenIcon token={token} className="h-6" />
          <strong className="text-basics-black font-semibold">{token.symbol}</strong>
        </div>
        <h3 className="text-basics-black">Collateral {collateralActionToVerb[collateralSetting]}</h3>
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onProceed}>Back to Dashboard</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}

const collateralActionToVerb: Record<CollateralSetting, string> = {
  enabled: 'enabled',
  disabled: 'disabled',
}
