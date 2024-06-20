import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { DepositToSDaiActionRow } from '../common/components/DepositToSDaiActionRow'
import { XDaiToSDaiDepositAction } from './types'

export interface XDaiToSDaiDepositActionRowProps extends ActionRowBaseProps {
  action: XDaiToSDaiDepositAction
}

export function XDaiToSDaiDepositActionRow({ action, ...rest }: XDaiToSDaiDepositActionRowProps) {
  return <DepositToSDaiActionRow fromToken={action.xDai} toToken={action.sDai} value={action.value} {...rest} />
}
