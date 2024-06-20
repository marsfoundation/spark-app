import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

export interface WithdrawFromSDaiActionRowProps extends ActionRowBaseProps {
  fromToken: Token
  toToken: Token
  value: NormalizedUnitNumber
}

export function WithdrawFromSDaiActionRow({
  fromToken,
  toToken,
  value,
  index,
  actionHandlerState,
  onAction,
  variant,
}: WithdrawFromSDaiActionRowProps) {
  const tokenIconPaths = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Unwrapped ${fromToken.format(value, { style: 'auto' })} ${toToken.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Unwrap {fromToken.symbol} into {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={toToken} value={value} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Unwrap
      </ActionRow.Action>
    </ActionRow>
  )
}
