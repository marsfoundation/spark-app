import { useLiFiTxData } from '@/domain/exchanges/lifi/useLiFiTxData'
import { SwapInfo, SwapParams, SwapParamsBase } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useActionsSettings } from '@/domain/state'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

import { evaluateSwap } from './evaluateSwap'

interface UseSwapParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
}

export function useSwap({ formValues, marketInfo }: UseSwapParams): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const settings = useActionsSettings()
  const sDAI = marketInfo.sDAI

  const swapParamsBase: SwapParamsBase = {
    type: 'direct',
    fromToken: formValues.token,
    toToken: sDAI,
    value: NormalizedUnitNumber(formValues.value),
  }
  const swapParams: SwapParams = {
    ...swapParamsBase,
    meta: evaluateSwap(swapParamsBase, { maxSlippage: settings.exchangeMaxSlippage }),
  }

  const swapInfo = useLiFiTxData({
    swapParams,
  })

  return { swapParams, swapInfo }
}
