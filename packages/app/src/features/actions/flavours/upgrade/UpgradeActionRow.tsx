import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowBigUpDashIcon } from 'lucide-react'
import { UpgradeAction } from './types'

export interface UpgradeActionRowProps extends ActionRowBaseProps {
  action: UpgradeAction
}

export function UpgradeActionRow({
  action: { fromToken, toToken, amount },
  onAction,
  layout,
  ...props
}: UpgradeActionRowProps) {
  const tokenIcons = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowBigUpDashIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        Upgrade {fromToken.symbol} to {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={fromToken} amount={amount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Upgrade</ActionRow.Trigger>
    </ActionRow>
  )
}
