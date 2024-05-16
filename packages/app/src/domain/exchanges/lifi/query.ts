import { queryOptions } from '@tanstack/react-query'
import invariant from 'tiny-invariant'
import { zeroAddress } from 'viem'

import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '../../types/NumericValues'
import { SwapRequest } from '../types'
import { LiFi } from './lifi'
import { LifiQueryMetaEvaluator } from './meta'
import { QuoteResponse } from './types'

export interface FetchLiFiTxDataParams {
  client: LiFi
  type: 'direct' | 'reverse'
  fromToken: CheckedAddress
  toToken: CheckedAddress
  amount: BaseUnitNumber
  maxSlippage: Percentage
  userAddress: CheckedAddress
  chainId: number
  allowExchanges?: string[]
  queryMetaEvaluator: LifiQueryMetaEvaluator
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function fetchLiFiTxData({
  client,
  type,
  fromToken,
  toToken,
  amount,
  maxSlippage,
  queryMetaEvaluator,
  userAddress,
  chainId,
}: FetchLiFiTxDataParams) {
  return queryOptions<SwapRequest>({
    queryKey: ['liFiTxData', client.getKey(chainId, userAddress), type, fromToken, toToken, amount, maxSlippage],
    queryFn: async (): Promise<SwapRequest> => {
      if (import.meta.env.STORYBOOK_PREVIEW) {
        return {
          txRequest: {
            data: '0x4630a0d8', // just a sighash
            from: zeroAddress,
            to: zeroAddress,
            value: 0n,
            gasPrice: 0n,
            gasLimit: 0n,
          },
          fromToken: CheckedAddress(zeroAddress),
          toToken: CheckedAddress(zeroAddress),
          type: 'direct',

          estimate: {
            fromAmount: BaseUnitNumber(1n),
            toAmount: BaseUnitNumber(1n),
            toAmountMin: BaseUnitNumber(1n),
            feeCostsUSD: NormalizedUnitNumber(1),
          },
        }
      }

      const { meta, paramOverrides } = queryMetaEvaluator.evaluate({ fromToken, toToken })

      if (type === 'direct') {
        const response = await client.getQuote({
          fromToken,
          toToken,
          amount,
          maxSlippage,
          userAddress,
          chainId,
          ...paramOverrides,
          meta,
        })
        const fromAmount = BaseUnitNumber(response.estimate.fromAmount)
        invariant(amount.eq(fromAmount), 'amount should eq fromAmount')
        invariant(response.action.slippage.eq(maxSlippage), 'slippage should eq maxSlippage')

        return {
          txRequest: response.transactionRequest,
          fromToken: CheckedAddress(response.action.fromToken.address),
          toToken: CheckedAddress(response.action.toToken.address),
          type: 'direct',

          estimate: {
            fromAmount,
            toAmount: BaseUnitNumber(response.estimate.toAmount),
            toAmountMin: BaseUnitNumber(response.estimate.toAmountMin),
            feeCostsUSD: calculateFees(response.estimate.feeCosts),
          },
        }
      } else {
        const response = await client.getReverseQuote({
          fromToken,
          toToken,
          amount,
          maxSlippage,
          userAddress,
          chainId,
          ...paramOverrides,
          meta,
        })

        invariant(response.action.slippage.eq(maxSlippage), 'slippage should eq maxSlippage')

        return {
          txRequest: response.transactionRequest,
          fromToken: CheckedAddress(response.action.fromToken.address),
          toToken: CheckedAddress(response.action.toToken.address),
          type: 'reverse',

          estimate: {
            fromAmount: BaseUnitNumber(response.estimate.fromAmount),
            toAmount: BaseUnitNumber(response.estimate.toAmount),
            toAmountMin: BaseUnitNumber(response.estimate.toAmountMin),
            feeCostsUSD: calculateFees(response.estimate.feeCosts),
          },
        }
      }
    },
  })
}

function calculateFees(feeCosts: QuoteResponse['estimate']['feeCosts']): NormalizedUnitNumber {
  return feeCosts.reduce((acc, { amountUSD }) => NormalizedUnitNumber(acc.plus(amountUSD)), NormalizedUnitNumber(0))
}
