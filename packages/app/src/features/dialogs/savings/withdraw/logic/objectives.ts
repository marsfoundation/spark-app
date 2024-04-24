import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
}
export function createObjectives({ swapInfo, swapParams }: CreateObjectivesParams): ExchangeObjective[] {
  return [
    {
      type: 'exchange',
      swapInfo: simplifyQueryResult(swapInfo),
      swapParams,
    },
  ]
}
