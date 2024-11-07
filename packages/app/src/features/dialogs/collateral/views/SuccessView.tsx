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
      <SuccessViewSummaryPanel className="typography-label-4 text-primary">
        <div className="flex items-center gap-2">
          <TokenIcon token={token} className="h-5" />
          {token.symbol}
        </div>
        Collateral {collateralActionToVerb[collateralSetting]}
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onProceed}>View in portfolio</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}

const collateralActionToVerb: Record<CollateralSetting, string> = {
  enabled: 'enabled',
  disabled: 'disabled',
}
