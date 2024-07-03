import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { WithdrawFromSDaiActionRow } from '../common/components/WithdrawFromSDaiActionRow'
import { DaiFromSDaiWithdrawAction } from './types'

export interface DaiFromSDaiWithdrawActionRowProps extends ActionRowBaseProps {
  action: DaiFromSDaiWithdrawAction
}

export function DaiFromSDaiWithdrawActionRow({ action, ...rest }: DaiFromSDaiWithdrawActionRowProps) {
  return (
    <WithdrawFromSDaiActionRow
      fromToken={action.sDai}
      toToken={action.dai}
      value={action.value}
      isSendMode={action.receiver !== undefined}
      {...rest}
    />
  )
}
