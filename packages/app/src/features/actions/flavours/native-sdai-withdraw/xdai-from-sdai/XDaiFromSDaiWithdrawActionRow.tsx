import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { WithdrawFromSDaiActionRow } from '../common/components/WithdrawFromSDaiActionRow'
import { XDaiFromSDaiWithdrawAction } from './types'

export interface XDaiFromSDaiWithdrawActionRowProps extends ActionRowBaseProps {
  action: XDaiFromSDaiWithdrawAction
}

export function XDaiFromSDaiWithdrawActionRow({ action, ...rest }: XDaiFromSDaiWithdrawActionRowProps) {
  return <WithdrawFromSDaiActionRow fromToken={action.sDai} toToken={action.xDai} value={action.value} {...rest} />
}
