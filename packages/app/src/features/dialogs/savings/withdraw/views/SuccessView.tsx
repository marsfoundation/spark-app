import { TokenWithValue } from '@/domain/common/types'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { SuccessViewCheckmark } from '@/features/dialogs/common/components/success-view/SuccessViewCheckmark'
import { SuccessViewContent } from '@/features/dialogs/common/components/success-view/SuccessViewContent'
import { SuccessViewProceedButton } from '@/features/dialogs/common/components/success-view/SuccessViewProceedButton'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Address } from '@/ui/atoms/address/Address'
import { Link } from '@/ui/atoms/link/Link'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'
import { testIds } from '@/ui/utils/testIds'
import { SendModeExtension } from '../types'

export interface SuccessViewProps {
  tokenToWithdraw: TokenWithValue
  closeDialog: () => void
  sendModeExtension?: Pick<SendModeExtension, 'receiver' | 'blockExplorerAddressLink'>
}
export function SuccessView({ tokenToWithdraw, closeDialog, sendModeExtension }: SuccessViewProps) {
  const { token, value } = tokenToWithdraw
  const panelTitle = sendModeExtension ? 'Sent' : 'Withdrew'

  return (
    <SuccessViewContent>
      <SuccessViewCheckmark />
      <Panel.Wrapper className="mt-8 flex w-full flex-col gap-4 bg-panel-bg p-4">
        <DialogPanelTitle>{panelTitle}</DialogPanelTitle>
        <div className="flex flex-col gap-4" data-testid={testIds.dialog.success}>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <TokenIcon token={token} className="h-6" />
              <span className="font-semibold text-basics-black">{token.symbol}</span>
            </div>
            <div className="flex grow flex-col">
              <Typography className="text-right font-primary">{token.format(value, { style: 'auto' })}</Typography>
              <Typography variant="prompt" className="text-right">
                {token.formatUSD(value)}
              </Typography>
            </div>
          </div>
          {sendModeExtension?.receiver && (
            <div className="flex items-center justify-between gap-2 border-basics-border border-t py-4">
              <Typography>Recipient</Typography>
              <Typography variant="prompt" className="flex min-w-0 flex-1 gap-1.5 text-sm">
                <Address
                  className="justify-end"
                  address={sendModeExtension.receiver}
                  inlineIcon={
                    sendModeExtension.blockExplorerAddressLink ? (
                      <Link
                        to={sendModeExtension.blockExplorerAddressLink}
                        external
                        className="flex items-center gap-2.5 font-medium text-basics-dark-grey text-sm"
                      >
                        <BoxArrowTopRight className="h-4 w-4" />
                      </Link>
                    ) : undefined
                  }
                />
              </Typography>
            </div>
          )}
        </div>
      </Panel.Wrapper>
      <SuccessViewProceedButton onProceed={closeDialog}>Back to Savings</SuccessViewProceedButton>
    </SuccessViewContent>
  )
}
