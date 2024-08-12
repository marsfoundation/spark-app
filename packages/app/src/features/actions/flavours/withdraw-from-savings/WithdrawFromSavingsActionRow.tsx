import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { WithdrawFromSavingsAction } from './types'

export interface WithdrawFromSavingsActionRowProps extends ActionRowBaseProps {
  action: WithdrawFromSavingsAction
}

export function WithdrawFromSavingsActionRow({
  action: { savingsToken, token, amount, mode },
  index,
  actionHandlerState,
  onAction,
  variant,
}: WithdrawFromSavingsActionRowProps) {
  const tokenIconPaths = [getTokenImage(savingsToken.symbol), getTokenImage(token.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Converted${mode === 'send' ? ' and sent' : ''} ${savingsToken.format(amount, { style: 'auto' })} ${token.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Convert {savingsToken.symbol} to {token.symbol}
        {mode === 'send' ? ' and send' : ''}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={token} value={amount} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        {mode === 'send' ? 'Send' : 'Convert'}
      </ActionRow.Action>
    </ActionRow>
  )
}
