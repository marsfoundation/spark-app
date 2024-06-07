import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { NativeSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  useNativeRoutes: boolean
}
export function createObjectives({
  swapInfo,
  swapParams,
  formValues,
  marketInfo,
  savingsInfo,
  useNativeRoutes,
}: CreateObjectivesParams): (ExchangeObjective | NativeSDaiDepositObjective)[] {
  if (useNativeRoutes) {
    return [
      {
        type: 'nativeSDaiDeposit',
        token: formValues.token,
        value: formValues.value,
        sDai: marketInfo.sDAI,
      },
    ]
  }
  const DAI = marketInfo.DAI

  return [
    {
      type: 'exchange',
      swapInfo: simplifyQueryResult(swapInfo),
      swapParams,
      formatAsDAIValue: (amount: NormalizedUnitNumber) =>
        DAI.format(
          savingsInfo.convertSharesToDai({
            shares: amount,
          }),
          { style: 'auto' },
        ),
    },
  ]
}
