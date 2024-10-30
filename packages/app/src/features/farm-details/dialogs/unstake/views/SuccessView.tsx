import { TokenWithValue } from '@/domain/common/types'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'
import { testIds } from '@/ui/utils/testIds'

export interface SuccessViewProps {
  outcome: TokenWithValue
  reward: TokenWithValue
  closeDialog: () => void
  isExiting: boolean
}
export function SuccessView({ outcome, reward, closeDialog, isExiting }: SuccessViewProps) {
  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <Panel.Wrapper className="mt-8 flex w-full flex-col gap-4 bg-panel-bg p-4">
        <div className="flex flex-col gap-4" data-testid={testIds.dialog.success}>
          <DialogPanelTitle>Withdrew</DialogPanelTitle>
          <div className="mb-2 flex justify-between">
            <div className="flex items-center gap-2">
              <TokenIcon token={outcome.token} className="h-6" />
              <span className="font-semibold">{outcome.token.symbol}</span>
            </div>
            <div className="flex grow flex-col">
              <Typography className="text-right font-primary">
                {outcome.token.format(outcome.value, { style: 'auto' })}
              </Typography>
              <Typography variant="prompt" className="text-right">
                {outcome.token.formatUSD(outcome.value)}
              </Typography>
            </div>
          </div>
          {isExiting && (
            <>
              <DialogPanelTitle>Claimed</DialogPanelTitle>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <TokenIcon token={reward.token} className="h-6" />
                  <span className="font-semibold">{reward.token.symbol}</span>
                </div>
                <div className="flex grow flex-col">
                  <Typography className="text-right font-primary">
                    {reward.token.format(reward.value, { style: 'auto' })}
                  </Typography>
                  <Typography variant="prompt" className="text-right">
                    {reward.token.formatUSD(reward.value)}
                  </Typography>
                </div>
              </div>
            </>
          )}
        </div>
      </Panel.Wrapper>
      <SuccessViewProceedButton onProceed={closeDialog}>Back to Farm</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
