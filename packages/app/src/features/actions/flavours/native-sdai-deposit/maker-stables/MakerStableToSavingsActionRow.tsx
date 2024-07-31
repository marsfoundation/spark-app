import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { DepositToSDaiActionRow } from '../common/components/DepositToSDaiActionRow'
import { MakerStableToSavingsAction } from './types'

export interface MakerStableToSavingsActionRowProps extends ActionRowBaseProps {
  action: MakerStableToSavingsAction
}

export function MakerStableToSavingsActionRow({ action, ...rest }: MakerStableToSavingsActionRowProps) {
  return (
    <DepositToSDaiActionRow
      fromToken={action.stableToken}
      toToken={action.savingsToken}
      value={action.value}
      {...rest}
    />
  )
}
