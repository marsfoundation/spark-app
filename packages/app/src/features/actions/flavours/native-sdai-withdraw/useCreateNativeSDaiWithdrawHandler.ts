import { useVaultWithdraw } from '@/domain/tokenized-vault-operations/useVaultWithdraw'

import { useRedeemAndSwap } from '@/domain/psm-actions/redeem-and-swap/useRedeemAndSwap'
import { useWithdrawAndSwap } from '@/domain/psm-actions/useWithdrawAndSwap'
import { useVaultRedeem } from '@/domain/tokenized-vault-operations/useVaultRedeem'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeSDaiWithdrawAction } from './types'

export interface UseCreateNativeSDaiWithdrawHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeSDaiWithdrawHandler(
  action: NativeSDaiWithdrawAction,
  options: UseCreateNativeSDaiWithdrawHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options
  const isUSDCWithdraw = action.token.symbol === 'USDC'
  const isWithdraw = action.method === 'withdraw'
  const isRedeem = action.method === 'redeem'

  const daiWithdraw = useVaultWithdraw({
    vault: action.sDai.address,
    assetsAmount: isWithdraw ? action.token.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isWithdraw && !isUSDCWithdraw,
    onTransactionSettled: onFinish,
  })
  const daiRedeem = useVaultRedeem({
    vault: action.sDai.address,
    sharesAmount: isRedeem ? action.sDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isRedeem && !isUSDCWithdraw,
    onTransactionSettled: onFinish,
  })

  const usdcWithdraw = useWithdrawAndSwap({
    assetsToken: action.sDai,
    gem: action.token,
    gemAmountOut: isWithdraw ? action.token.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isWithdraw && isUSDCWithdraw,
    onTransactionSettled: onFinish,
  })
  const usdcRedeem = useRedeemAndSwap({
    assetsToken: action.sDai,
    gem: action.token,
    sharesAmount: isRedeem ? action.sDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isRedeem && isUSDCWithdraw,
    onTransactionSettled: onFinish,
  })

  const withdraw = isUSDCWithdraw ? usdcWithdraw : daiWithdraw
  const redeem = isUSDCWithdraw ? usdcRedeem : daiRedeem

  const hookResult = isWithdraw ? withdraw : redeem

  return {
    action,
    state: mapWriteResultToActionState(hookResult),
    onAction: hookResult.write,
  }
}
