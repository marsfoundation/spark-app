import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { DepositToSDaiActionRow } from '../common/components/DepositToSDaiActionRow'
import { DaiToSDaiDepositAction } from './types'

export interface DaiToSDaiDepositActionRowProps extends ActionRowBaseProps {
  action: DaiToSDaiDepositAction
}

export function DaiToSDaiDepositActionRow({ action, ...rest }: DaiToSDaiDepositActionRowProps) {
  return <DepositToSDaiActionRow fromToken={action.dai} toToken={action.sDai} value={action.value} {...rest} />
}
