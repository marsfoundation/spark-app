import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig, UseEstimateGasParameters } from 'wagmi'

import { SimplifiedQueryResult } from '@/features/actions/logic/simplifyQueryResult'

import { SwapInfoSimplified, SwapRequest } from '../exchanges/types'
import { useSendTx, UseSendTxResult } from '../hooks/useSendTx'
import { WriteStatus } from '../hooks/useWrite'
import { aaveDataLayer } from '../market-info/aave-data-layer/query'
import { BaseUnitNumber, NormalizedUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'
import { allowance } from './allowance/query'

export interface UseExchangeParams {
  swapInfo: SimplifiedQueryResult<SwapRequest>
  enabled?: boolean
  onTransactionSettled?: () => void
}

export type ExchangeStatus =
  | WriteStatus
  | (
      | { kind: 'error'; errorKind: 'fetching-quote-error'; error: Error } // adds new error kind
      | { kind: 'fetching-quote' }
    )

export interface ExchangeEstimate {
  USDFee: NormalizedUnitNumber
  fromAmount: BaseUnitNumber
  toAmount: BaseUnitNumber
}

export interface UseExchangeResult {
  send: () => void
  resimulate: () => void
  reset: () => void
  estimate: ExchangeEstimate | undefined
  status: ExchangeStatus
}

export function useExchange({ swapInfo, enabled = true, onTransactionSettled }: UseExchangeParams): UseExchangeResult {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()

  const request = useSendTx(
    {
      ...normalizeSwapRequest(swapInfo.data),
      enabled: enabled && swapInfo.data !== undefined,
    },
    {
      onTransactionSettled: () => {
        if (swapInfo.data?.txRequest.to && userAddress) {
          void client.invalidateQueries({
            queryKey: allowance({
              wagmiConfig,
              token: swapInfo.data!.fromToken,
              spender: swapInfo.data.txRequest.to,
              account: userAddress,
              chainId,
            }).queryKey,
          })
        }
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )

  return extendExchangeRequest(request, swapInfo, enabled)
}

function extendExchangeRequest(
  request: UseSendTxResult,
  swapInfo: SwapInfoSimplified,
  enabled?: boolean,
): UseExchangeResult {
  const status = ((): ExchangeStatus => {
    if (!enabled) {
      return { kind: 'disabled' }
    }

    if (swapInfo.status === 'error') {
      return { kind: 'error', errorKind: 'fetching-quote-error', error: swapInfo.error }
    }

    if (swapInfo.status === 'pending') {
      return { kind: 'fetching-quote' }
    }

    return request.status
  })()

  return {
    ...request,
    reset: async () => {
      request.reset()
    },
    status,
    estimate: getEstimate(swapInfo.data),
  }
}

function normalizeSwapRequest(data: SwapRequest | undefined): UseEstimateGasParameters | undefined {
  if (data) {
    return {
      to: data.txRequest.to,
      value: data.txRequest.value,
      data: data.txRequest.data,
      gas: data.txRequest.gasLimit,
    }
  }

  return undefined
}

function getEstimate(data: SwapRequest | undefined): ExchangeEstimate | undefined {
  if (data) {
    return {
      USDFee: data.estimate.feeCostsUSD,
      fromAmount: BaseUnitNumber(data.estimate.fromAmount),
      toAmount: BaseUnitNumber(data.estimate.toAmount),
    }
  }
  return undefined
}
