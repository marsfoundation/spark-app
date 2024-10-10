import { TokenWithAmountAndOptionalPrice } from '@/domain/common/types'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import { SuccessViewSummaryPanel } from '@/features/dialogs/common/components/success-view/SuccessViewSummaryPanel'
import { objectiveTypeToVerb } from '@/features/dialogs/common/logic/title'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface SuccessViewProps {
  reward: TokenWithAmountAndOptionalPrice
  closeDialog: () => void
}
export function SuccessView({ reward, closeDialog }: SuccessViewProps) {
  const { token, tokenPrice, amount } = reward

  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <SuccessViewSummaryPanel title={objectiveTypeToVerb.claimFarmRewards}>
        <div className="flex items-center gap-2">
          <TokenIcon token={reward.token} className="h-6" />
          <span className="font-semibold text-basics-black">{token.symbol}</span>
        </div>
        <div className="flex grow flex-col">
          <Typography className="text-right font-primary">
            {token.format(amount, { style: 'auto', tokenUnitPriceOverride: tokenPrice })}
          </Typography>
          {tokenPrice && (
            <Typography variant="prompt" className="text-right">
              {token.formatUSD(amount, { tokenUnitPriceOverride: tokenPrice })}
            </Typography>
          )}
        </div>
      </SuccessViewSummaryPanel>
      <SuccessViewProceedButton onProceed={closeDialog}>Back to Farm</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
