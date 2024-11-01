import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowBigDownDashIcon } from 'lucide-react'
import { DowngradeAction } from './types'

export interface DowngradeActionRowProps extends ActionRowBaseProps {
  action: DowngradeAction
}

export function DowngradeActionRow({
  action: { fromToken, toToken, amount },
  onAction,
  layout,
  ...props
}: DowngradeActionRowProps) {
  const tokenIcons = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowBigDownDashIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        Downgrade {fromToken.symbol} to {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={fromToken} amount={amount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Downgrade</ActionRow.Trigger>
    </ActionRow>
  )
}
