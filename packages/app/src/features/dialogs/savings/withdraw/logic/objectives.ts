import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { NativeSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  useNativeRoutes: boolean
}
export function createObjectives({
  swapInfo,
  swapParams,
  formValues,
  marketInfo,
  walletInfo,
  useNativeRoutes,
}: CreateObjectivesParams): (ExchangeObjective | NativeSDaiWithdrawObjective)[] {
  if (useNativeRoutes) {
    if (formValues.isMaxSelected) {
      const sDaiBalance = walletInfo.findWalletBalanceForToken(marketInfo.sDAI)

      return [
        {
          type: 'nativeSDaiWithdraw',
          token: formValues.token,
          value: sDaiBalance,
          sDai: marketInfo.sDAI,
          method: 'redeem',
        },
      ]
    }

    return [
      {
        type: 'nativeSDaiWithdraw',
        token: formValues.token,
        value: formValues.value,
        sDai: marketInfo.sDAI,
        method: 'withdraw',
      },
    ]
  }

  return [
    {
      type: 'exchange',
      swapInfo: simplifyQueryResult(swapInfo),
      swapParams,
    },
  ]
}
