import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowRightLeftIcon } from 'lucide-react'
import { PsmConvertAction } from './types'

export interface PsmConvertActionRowProps extends ActionRowBaseProps {
  action: PsmConvertAction
}

export function PsmConvertActionRow({
  action: { inToken, outToken, amount },
  onAction,
  layout,
  ...props
}: PsmConvertActionRowProps) {
  const tokenIcons = [getTokenImage(inToken.symbol), getTokenImage(outToken.symbol)]

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowRightLeftIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        Convert {inToken.symbol} to {outToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={inToken} amount={amount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Convert</ActionRow.Trigger>
    </ActionRow>
  )
}
