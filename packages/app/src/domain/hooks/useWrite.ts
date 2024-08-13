import { Abi, ContractFunctionName, encodeFunctionData } from 'viem'
import {
  UseSimulateContractParameters,
  UseWriteContractParameters,
  UseWriteContractReturnType,
  useAccount,
  useConfig,
  useSimulateContract,
} from 'wagmi'

import { __TX_LIST_KEY } from '@/test/e2e/constants'
import { JSONStringifyRich } from '@/utils/object'
import { useOnDepsChange } from '@/utils/useOnDepsChange'
import { MutationKey, useMutation } from '@tanstack/react-query'
import { writeContractMutationOptions } from 'wagmi/query'
import { recordEvent } from '../analytics'
import { sanityCheckTx } from './sanityChecks'
import { useOriginChainId } from './useOriginChainId'
import { useWaitForTransactionReceiptUniversal } from './useWaitForTransactionReceiptUniversal'
import { useWalletType } from './useWalletType'

export type WriteStatus =
  | { kind: 'disabled' }
  | { kind: 'simulating' }
  | { kind: 'ready' }
  | { kind: 'tx-sending' }
  | { kind: 'tx-mining' }
  | { kind: 'success' }
  | { kind: 'error'; errorKind: WriteErrorKind; error: Error }
export type WriteErrorKind = 'simulation' | 'tx-submission' | 'tx-reverted'

export interface UseWriteResult {
  write: () => void
  resimulate: () => void
  reset: () => void
  status: WriteStatus
}

export interface UseWriteCallbacks {
  onTransactionSettled?: () => void
  onBeforeWrite?: () => void // @note: good place to run extra sanity checks
}

/**
 * Write to a contract with a sane API.
 * - Prepares txs
 * - Waits for tx to be mined
 * - Does not propagate simulation errors if disabled
 */
export function useWrite<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>>(
  args: UseSimulateContractParameters<TAbi, TFunctionName> & { enabled?: boolean },
  callbacks: UseWriteCallbacks = {},
): UseWriteResult {
  const chainId = useOriginChainId()
  const enabled = args.enabled ?? true
  // used to reset the write state when the args change

  const { address: account } = useAccount()
  const walletType = useWalletType() // needed for analytics
  const {
    data: parameters,
    error: _simulationError,
    refetch: resimulate,
    isLoading: isSimulationLoading,
  } = useSimulateContract({
    account,
    ...args,
    query: {
      gcTime: 0,
      enabled,
      ...args.query,
    },
  } as any)
  // @note: workaround for wagmi serving results from cache even if enabled = false. https://github.com/wevm/wagmi/issues/888
  const simulationError = enabled ? _simulationError : undefined

  const {
    writeContract,
    data: txHash,
    isPending: isTxSending,
    isSuccess: wasTxSent,
    error: _txSubmissionError,
    reset,
  } = useWriteContract({ mutationKey: getWriteContractMutationKey(args as any) })

  const { data: txReceipt, error: txReceiptError } = useWaitForTransactionReceiptUniversal({
    hash: txHash,
  })
  const txSubmissionError = enabled ? _txSubmissionError : undefined

  useOnDepsChange(() => {
    if (txReceipt) {
      callbacks.onTransactionSettled?.()
      if (import.meta.env.VITE_PLAYWRIGHT === '1') {
        // @note: for e2e tests needs we store sent transactions
        storeRequest(parameters?.request)
      }
    }
  }, [txReceipt])

  const status = ((): WriteStatus => {
    if (!enabled) {
      return { kind: 'disabled' }
    }
    if (isSimulationLoading) {
      return { kind: 'simulating' }
    }
    if (simulationError) {
      return { kind: 'error', errorKind: 'simulation', error: simulationError }
    }
    if (isTxSending) {
      return { kind: 'tx-sending' }
    }
    if (txSubmissionError) {
      return { kind: 'error', errorKind: 'tx-submission', error: txSubmissionError }
    }
    if (wasTxSent && txReceipt) {
      // txReceipt is only available when tx didn't revert
      return { kind: 'success' }
    }
    if (wasTxSent && txReceiptError) {
      return { kind: 'error', errorKind: 'tx-reverted', error: txReceiptError }
    }
    if (wasTxSent) {
      return { kind: 'tx-mining' }
    }

    return { kind: 'ready' }
  })()

  const finalWrite =
    parameters && enabled
      ? () => {
          sanityCheckTx(parameters.request, chainId)
          callbacks.onBeforeWrite?.()

          if (walletType === 'sandbox') {
            recordEvent('sandbox-tx-sent', {
              receiver: parameters.request.address,
              method: parameters.request.functionName,
            })
          } else {
            recordEvent('tx-sent', {
              walletType,
              chainId,
              receiver: parameters.request.address,
              method: parameters.request.functionName,
            })
          }

          writeContract(parameters.request as any)
        }
      : () => {}

  return {
    reset,
    write: finalWrite,
    resimulate,
    status,
  }
}

// useful for creating conditional configs without losing type-safety
export function ensureConfigTypes<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
>(config: UseSimulateContractParameters<TAbi, TFunctionName>): UseSimulateContractParameters<Abi, string> {
  return config as any
}

function storeRequest(request: any): void {
  if (!request) {
    return
  }
  const txList: any[] = Array.isArray(window[__TX_LIST_KEY]) ? (window[__TX_LIST_KEY] as any) : []
  const calldata = encodeFunctionData(request as any)
  txList.push({ ...request, calldata })
  window[__TX_LIST_KEY] = txList as any
}

// @note: This function is a copy of Wagmi's useWriteContract with an option to pass a mutationKey.
// Passing custom mutationKey can be useful for resetting/invalidating mutation.
function useWriteContract(
  parameters: UseWriteContractParameters & { mutationKey?: MutationKey } = {},
): UseWriteContractReturnType {
  const { mutation, mutationKey } = parameters

  const config = useConfig(parameters)

  const mutationOptions = writeContractMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
    mutationKey,
  })

  type Return = UseWriteContractReturnType
  return {
    ...result,
    writeContract: mutate as Return['writeContract'],
    writeContractAsync: mutateAsync as Return['writeContractAsync'],
  }
}

function getWriteContractMutationKey(args: UseSimulateContractParameters<Abi, string>): MutationKey {
  return [args.chainId, args.address, args.functionName, JSONStringifyRich(args.args)]
}
