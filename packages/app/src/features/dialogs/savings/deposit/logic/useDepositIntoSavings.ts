import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { useSwap } from '@/domain/exchanges/useSwap'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useActionsSettings } from '@/domain/state'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

interface UseSwapParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
}

export function useDepositIntoSavings({ formValues, marketInfo }: UseSwapParams): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const settings = useActionsSettings()
  const sdai = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))

  return useSwap({
    swapParamsBase: {
      type: 'direct',
      fromToken: formValues.token,
      toToken: sdai,
      value: NormalizedUnitNumber(formValues.value),
    },
    defaults: { defaultMaxSlippage: settings.exchangeMaxSlippage },
  })
}
