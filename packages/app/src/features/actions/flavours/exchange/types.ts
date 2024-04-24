import { SwapParams, SwapRequest } from '@/domain/exchanges/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { SimplifiedQueryResult } from '../../logic/simplifyQueryResult'

export interface ExchangeObjective {
  type: 'exchange'
  swapParams: SwapParams
  swapInfo: SimplifiedQueryResult<SwapRequest>
  formatAsDAIValue?: (amount: NormalizedUnitNumber) => string
}

export interface ExchangeAction {
  type: 'exchange'
  value: NormalizedUnitNumber // tmp for compatibility
  swapParams: SwapParams
  swapInfo: SimplifiedQueryResult<SwapRequest>
  formatAsDAIValue?: (amount: NormalizedUnitNumber) => string
}
