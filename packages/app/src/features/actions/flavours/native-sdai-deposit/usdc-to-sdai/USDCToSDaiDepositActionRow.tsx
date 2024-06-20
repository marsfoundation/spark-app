import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { DepositToSDaiActionRow } from '../common/components/DepositToSDaiActionRow'
import { USDCToSDaiDepositAction } from './types'

export interface USDCToSDaiDepositActionRowProps extends ActionRowBaseProps {
  action: USDCToSDaiDepositAction
}

export function USDCToSDaiDepositActionRow({ action, ...rest }: USDCToSDaiDepositActionRowProps) {
  return <DepositToSDaiActionRow fromToken={action.usdc} toToken={action.sDai} value={action.value} {...rest} />
}
