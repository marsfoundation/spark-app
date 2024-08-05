import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { DepositToSDaiActionRow } from '../common/components/DepositToSDaiActionRow'
import { MigrateDAIToSNSTAction } from './types'

export interface MigrateDAIToSNSTActionActionRowProps extends ActionRowBaseProps {
  action: MigrateDAIToSNSTAction
}

export function MigrateDAIToSNSTActionActionRow({ action, ...rest }: MigrateDAIToSNSTActionActionRowProps) {
  return (
    <DepositToSDaiActionRow
      fromToken={action.stableToken}
      toToken={action.savingsToken}
      value={action.value}
      {...rest}
    />
  )
}
