import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { WithdrawFromSDaiActionRow } from '../common/components/WithdrawFromSDaiActionRow'
import { USDCFromSDaiWithdrawAction } from './types'

export interface USDCFromSDaiWithdrawActionRowProps extends ActionRowBaseProps {
  action: USDCFromSDaiWithdrawAction
}

export function USDCFromSDaiWithdrawActionRow({ action, ...rest }: USDCFromSDaiWithdrawActionRowProps) {
  return <WithdrawFromSDaiActionRow fromToken={action.sDai} toToken={action.usdc} value={action.value} {...rest} />
}
