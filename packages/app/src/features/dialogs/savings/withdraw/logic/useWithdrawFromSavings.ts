import { SwapInfo, SwapParams, SwapParamsBase } from '@/domain/exchanges/types'
import { useSwap } from '@/domain/exchanges/useSwap'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useActionsSettings } from '@/domain/state'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

interface UseSwapParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: MarketWalletInfo
  enabled: boolean
}

export function useWithdrawFromSavings({ formValues, marketInfo, walletInfo, enabled }: UseSwapParams): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const settings = useActionsSettings()
  const sDAI = marketInfo.sDAI
  const sDaiBalance = walletInfo.findWalletBalanceForToken(sDAI)

  const swapParamsBase: SwapParamsBase = formValues.isMaxSelected
    ? {
        type: 'direct',
        fromToken: sDAI,
        toToken: formValues.token,
        value: sDaiBalance,
      }
    : {
        type: 'reverse',
        fromToken: sDAI,
        toToken: formValues.token,
        value: NormalizedUnitNumber(formValues.value),
      }

  return useSwap({
    swapParamsBase,
    defaults: { defaultMaxSlippage: settings.exchangeMaxSlippage },
    enabled,
  })
}
