import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

export interface DepositToSDaiActionRowProps extends ActionRowBaseProps {
  fromToken: Token
  toToken: Token
  value: NormalizedUnitNumber
}

export function DepositToSDaiActionRow({
  fromToken,
  toToken,
  value,
  index,
  actionHandlerState,
  onAction,
  variant,
}: DepositToSDaiActionRowProps) {
  const tokenIconPaths = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Wrapped ${fromToken.format(value, { style: 'auto' })} ${fromToken.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Wrap {fromToken.symbol} into {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={fromToken} value={value} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Wrap
      </ActionRow.Action>
    </ActionRow>
  )
}
