import { useLifiQueryMetaEvaluator } from '@/domain/exchanges/lifi/meta'
import { useLiFiTxData } from '@/domain/exchanges/lifi/useLiFiTxData'
import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useActionsSettings } from '@/domain/state'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

interface UseSwapParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
}

export function useSwap({ formValues, marketInfo, walletInfo }: UseSwapParams): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const actionsSettings = useActionsSettings()
  const queryMetaEvaluator = useLifiQueryMetaEvaluator()
  const sDAI = marketInfo.sDAI
  const sDaiBalance = walletInfo.findWalletBalanceForToken(sDAI)

  const swapParams: SwapParams = formValues.isMaxSelected
    ? {
        type: 'direct',
        fromToken: sDAI,
        toToken: formValues.token,
        value: sDaiBalance,
        maxSlippage: actionsSettings.exchangeMaxSlippage,
      }
    : {
        type: 'reverse',
        fromToken: sDAI,
        toToken: formValues.token,
        value: NormalizedUnitNumber(formValues.value),
        maxSlippage: actionsSettings.exchangeMaxSlippage,
      }

  const swapInfo = useLiFiTxData({ swapParams, queryMetaEvaluator, enabled: true })

  return { swapParams, swapInfo }
}
