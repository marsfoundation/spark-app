import { z } from 'zod'

import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber } from '../../types/NumericValues'
import { quoteResponseSchema, reverseQuoteResponseSchema } from './validation'

export type QuoteResponse = z.infer<typeof quoteResponseSchema>
export type QuoteResponseRaw = z.input<typeof quoteResponseSchema>
export type ReverseQuoteResponse = z.infer<typeof reverseQuoteResponseSchema>

export interface LiFiTxData {
  txRequest: QuoteResponse['transactionRequest']
  estimate: {
    feeCosts: QuoteResponse['estimate']['feeCosts']
    fromAmount: BaseUnitNumber
    toAmount: BaseUnitNumber
  }
  action: {
    fromToken: CheckedAddress
    toToken: CheckedAddress
  }
}
