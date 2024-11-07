import { TokenWithValue } from '@/domain/common/types'
import { ObjectiveType } from '@/features/actions/logic/types'

import { SuccessViewCheckmark } from '../components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '../components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '../components/success-view/SuccessViewSummaryPanel'
import { SuccessViewTokenRow } from '../components/success-view/SuccessViewTokenRow'
import { objectiveTypeToVerb } from '../logic/title'

export interface SuccessViewProps {
  objectiveType: ObjectiveType
  tokenWithValue: TokenWithValue
  onProceed: () => void
  proceedText: string
  className?: string
}
export function SuccessView({ objectiveType, tokenWithValue, onProceed, proceedText, className }: SuccessViewProps) {
  const { token, value } = tokenWithValue

  return (
    <SuccessViewContent className={className}>
      <SuccessViewCheckmark />
      <SuccessViewSummaryPanel title={objectiveTypeToVerb[objectiveType]}>
        <SuccessViewTokenRow token={token} amount={value} />
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onProceed}>{proceedText}</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
