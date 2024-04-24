import { SwapParams, SwapRequest } from '@/domain/exchanges/types'

import { SimplifiedQueryResult } from '../../logic/simplifyQueryResult'

export interface ApproveExchangeAction {
  type: 'approveExchange'
  swapParams: SwapParams
  swapInfo: SimplifiedQueryResult<SwapRequest>
}
