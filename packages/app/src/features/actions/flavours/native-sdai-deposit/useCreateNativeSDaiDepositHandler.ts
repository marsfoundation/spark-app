import { useVaultDeposit } from '@/domain/tokenized-vault-operations/useVaultDeposit'

import { useSwapAndDeposit } from '@/domain/psm-actions/useSwapAndDeposit'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeSDaiDepositAction } from './types'

export interface UseCreateNativeSDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeSDaiDepositHandler(
  action: NativeSDaiDepositAction,
  options: UseCreateNativeSDaiDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options
  const isUSDCDeposit = action.token.symbol === TokenSymbol('USDC')

  const daiDeposit = useVaultDeposit({
    vault: action.sDai.address,
    assetsAmount: action.token.toBaseUnit(action.value),
    enabled: enabled && !isUSDCDeposit,
    onTransactionSettled: onFinish,
  })

  const usdcDeposit = useSwapAndDeposit({
    assetsToken: action.sDai,
    gem: action.token,
    gemAmount: action.token.toBaseUnit(action.value),
    enabled: enabled && isUSDCDeposit,
    onTransactionSettled: onFinish,
  })

  const deposit = isUSDCDeposit ? usdcDeposit : daiDeposit

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
