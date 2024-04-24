import { useLifiQueryMetaEvaluator } from '@/domain/exchanges/lifi/meta'
import { useLiFiTxData } from '@/domain/exchanges/lifi/useLiFiTxData'
import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { useActionsSettings } from '@/domain/state'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

interface UseSwapParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
}

export function useSwap({ formValues, marketInfo }: UseSwapParams): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const queryMetaEvaluator = useLifiQueryMetaEvaluator()
  const settings = useActionsSettings()
  const sdai = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))

  const swapParams: SwapParams = {
    type: 'direct',
    fromToken: formValues.token,
    toToken: sdai,
    value: NormalizedUnitNumber(formValues.value),
    maxSlippage: settings.exchangeMaxSlippage,
  }

  const swapInfo = useLiFiTxData({
    swapParams,
    queryMetaEvaluator,
  })

  return { swapParams, swapInfo }
}
