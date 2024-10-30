import { EModeCategoryName } from '@/domain/e-mode/types'

import { SuccessViewCheckmark } from '../../common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../../common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '../../common/components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '../../common/components/success-view/SuccessViewSummaryPanel'

export interface SuccessViewProps {
  eModeCategoryName: EModeCategoryName
  onProceed: () => void
}
export function SuccessView({ eModeCategoryName, onProceed }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewSummaryPanel>
        <strong className="font-semibold">{eModeCategoryName}</strong>
        <h3>Option activated</h3>
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onProceed}>View in portfolio</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
