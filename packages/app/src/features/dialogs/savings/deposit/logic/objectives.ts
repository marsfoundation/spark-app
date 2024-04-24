import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MakerInfo } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'
import { convertSharesToDai } from '@/features/savings/logic/projections'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
  marketInfo: MarketInfo
  makerInfo: MakerInfo
}
export function createObjectives({
  swapInfo,
  swapParams,
  marketInfo,
  makerInfo,
}: CreateObjectivesParams): ExchangeObjective[] {
  const DAI = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
  return [
    {
      type: 'exchange',
      swapInfo: simplifyQueryResult(swapInfo),
      swapParams,
      formatAsDAIValue: (amount: NormalizedUnitNumber) =>
        DAI.format(
          convertSharesToDai({
            potParams: makerInfo.potParameters,
            shares: amount,
            timestamp: marketInfo.timestamp,
          }),
          { style: 'auto' },
        ),
    },
  ]
}
