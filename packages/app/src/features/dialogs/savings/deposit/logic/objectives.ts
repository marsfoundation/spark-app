import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsManager } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
  marketInfo: MarketInfo
  savingsManager: SavingsManager
}
export function createObjectives({
  swapInfo,
  swapParams,
  marketInfo,
  savingsManager,
}: CreateObjectivesParams): ExchangeObjective[] {
  const DAI = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
  return [
    {
      type: 'exchange',
      swapInfo: simplifyQueryResult(swapInfo),
      swapParams,
      formatAsDAIValue: (amount: NormalizedUnitNumber) =>
        DAI.format(
          savingsManager.convertSharesToDai({
            shares: amount,
          }),
          { style: 'auto' },
        ),
    },
  ]
}
