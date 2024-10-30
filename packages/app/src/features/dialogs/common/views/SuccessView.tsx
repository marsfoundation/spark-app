import { TokenWithValue } from '@/domain/common/types'
import { ObjectiveType } from '@/features/actions/logic/types'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'

import { SuccessViewCheckmark } from '../components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '../components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '../components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '../components/success-view/SuccessViewSummaryPanel'
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
        <div className="flex items-center gap-2">
          <TokenIcon token={token} className="h-6" />
          <span className="font-semibold">{token.symbol}</span>
        </div>
        <div className="flex grow flex-col">
          <Typography className="text-right font-primary">{token.format(value, { style: 'auto' })}</Typography>
          <Typography variant="prompt" className="text-right">
            {token.formatUSD(value)}
          </Typography>
        </div>
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={onProceed}>{proceedText}</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
