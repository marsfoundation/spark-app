import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowUpToLineIcon } from 'lucide-react'
import { UnstakeAction } from './types'

export interface UnstakeActionRowProps extends ActionRowBaseProps {
  action: UnstakeAction
}

export function UnstakeActionRow({
  action: { stakingToken, rewardToken, amount, exit },
  onAction,
  layout,
  ...props
}: UnstakeActionRowProps) {
  const tokenIcons = [getTokenImage(rewardToken.symbol), getTokenImage(stakingToken.symbol)]
  const unstakeActionTitle = `Withdraw ${stakingToken.symbol} from ${rewardToken.symbol} Farm`
  const exitActionTitle = `Exit from ${rewardToken.symbol} Farm`

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        {exit ? exitActionTitle : unstakeActionTitle}
      </ActionRow.Title>

      <ActionRow.Amount token={stakingToken} amount={amount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>{exit ? 'Exit' : 'Withdraw'}</ActionRow.Trigger>
    </ActionRow>
  )
}
