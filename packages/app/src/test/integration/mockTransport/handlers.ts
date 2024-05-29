import { isDeepStrictEqual } from 'node:util'
import {
  Abi,
  ContractFunctionName,
  EncodeFunctionDataParameters,
  EncodeFunctionResultParameters,
  encodeFunctionData,
  encodeFunctionResult,
} from 'viem'

import { TestTrigger } from '../trigger'
import { RpcHandler } from './types'
import { cleanObject, encodeRpcQuantity, encodeRpcUnformattedData, getEmptyTxData, getEmptyTxReceipt } from './utils'

function blockNumberCall(block: number | bigint): RpcHandler {
  return (method) => {
    if (method === 'eth_blockNumber') {
      return encodeRpcQuantity(block)
    }
    return undefined
  }
}

function chainIdCall(opts: { chainId: number }): RpcHandler {
  return (method) => {
    if (method === 'eth_chainId') {
      return encodeRpcQuantity(opts.chainId)
    }
    return undefined
  }
}

function balanceCall(opts: { balance: bigint; address: string }): RpcHandler {
  return (method, [addr]) => {
    if (method === 'eth_getBalance' && addr === opts.address) {
      return encodeRpcQuantity(opts.balance)
    }
    return undefined
  }
}

function cleanParams(params: any): any {
  const { gas, ...striped } = params
  return cleanObject(striped)
}

function contractCall<TAbi extends Abi | readonly unknown[], TFunctionName extends ContractFunctionName<TAbi>>(
  opts: EncodeFunctionDataParameters<TAbi, TFunctionName> & {
    result: NonNullable<EncodeFunctionResultParameters<TAbi, TFunctionName>['result']> | undefined // forcing to specify result
  } & { to?: string; from?: string; value?: bigint },
): RpcHandler {
  return (method, [params]) => {
    if (method !== 'eth_call' && method !== 'eth_estimateGas') {
      return undefined
    }

    const actualExpected = {
      to: opts.to,
      from: opts.from,
      data: encodeFunctionData({
        abi: opts.abi,
        functionName: opts.functionName,
        args: opts.args ?? [],
      } as any),
      value: opts.value !== undefined ? encodeRpcQuantity(opts.value) : undefined,
    }

    if (!isDeepStrictEqual(cleanParams(params), cleanObject(actualExpected))) {
      return undefined
    }

    return encodeFunctionResult({
      abi: opts.abi,
      functionName: opts.functionName,
      result: opts.result,
    } as any)
  }
}

function contractCallError<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi> | undefined = undefined,
>(
  opts: EncodeFunctionDataParameters<TAbi, TFunctionName> & { to?: string; from?: string; errorMessage: string },
): RpcHandler {
  return (method, [params]) => {
    if (method !== 'eth_call') {
      return undefined
    }

    const actualExpected = {
      to: opts.to,
      from: opts.from,
      data: encodeFunctionData({
        abi: opts.abi,
        functionName: opts.functionName,
        args: opts.args ?? [],
      } as any),
    }

    if (!isDeepStrictEqual(cleanObject(params), cleanObject(actualExpected))) {
      return undefined
    }

    throw new MockError(opts.errorMessage)
  }
}

function mineTransaction(opts: { blockNumber?: number; txHash?: string } = {}): RpcHandler {
  const blockNumber = opts.blockNumber ?? 0
  const txHash = opts.txHash ?? '0xdeadbeef'

  return (method: string, params: any) => {
    if (method === 'eth_sendTransaction') {
      return encodeRpcUnformattedData(txHash)
    }

    if (method === 'eth_getTransactionByHash') {
      return {
        ...getEmptyTxData(),
        blockNumber: encodeRpcQuantity(blockNumber),
        txHash,
      }
    }

    if (method === 'eth_getTransactionReceipt') {
      return {
        ...getEmptyTxReceipt(),
        blockNumber: encodeRpcQuantity(blockNumber),
        txHash,
      }
    }

    // finally block number is checked
    return blockNumberCall(blockNumber)(method, params)
  }
}

function mineRevertedTransaction(opts: { blockNumber?: number; txHash?: string } = {}): RpcHandler {
  const blockNumber = opts.blockNumber ?? 0
  const txHash = opts.txHash ?? '0xdeadbeef'

  return (method: string, params: any) => {
    if (method === 'eth_sendTransaction') {
      return encodeRpcUnformattedData(txHash)
    }

    if (method === 'eth_getTransactionByHash') {
      return {
        ...getEmptyTxData(),
        blockNumber: encodeRpcQuantity(blockNumber),
        txHash,
      }
    }

    if (method === 'eth_getTransactionReceipt') {
      // @note: this is a hack to make wagmi treat this as a reverted transaction not submission error
      throw new Error('tx reverted')
    }

    // finally block number is checked
    return blockNumberCall(blockNumber)(method, params)
  }
}

function rejectSubmittedTransaction(opts: { blockNumber?: number; txHash?: string } = {}): RpcHandler {
  const blockNumber = opts.blockNumber ?? 0

  return (method: string, params: any) => {
    if (method === 'eth_sendTransaction') {
      throw new Error('user rejected')
    }

    // finally block number is checked
    return blockNumberCall(blockNumber)(method, params)
  }
}

export class MockError extends Error {
  public readonly code: number
  public readonly data: string

  constructor(public readonly message: string) {
    super(message)

    this.code = 3
    this.data = encodeFunctionData({
      abi: [
        {
          name: 'Error',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [{ internalType: 'string', name: 'reason', type: 'string' }],
          outputs: [],
        },
      ],
      functionName: 'Error',
      args: [message],
    })
  }
}

function triggerHandler(handler: RpcHandler, trigger: TestTrigger): RpcHandler {
  return (method, params) => {
    const response = handler(method, params)

    if (response === undefined) {
      return undefined
    }

    return trigger.then(() => response)
  }
}

function forceCallErrorHandler(callHandler: RpcHandler, errorMsg: string): RpcHandler {
  return (method, params) => {
    const response = callHandler(method, params)

    if (response === undefined) {
      return undefined
    }

    throw new MockError(errorMsg)
  }
}

export const handlers = {
  blockNumberCall,
  chainIdCall,
  balanceCall,
  contractCall,
  contractCallError,
  mineTransaction,
  mineRevertedTransaction,
  rejectSubmittedTransaction,
  triggerHandler,
  forceCallErrorHandler,
}
