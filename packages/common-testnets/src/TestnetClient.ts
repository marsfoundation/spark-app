import { Hash, raise } from '@marsfoundation/common-universal'
import {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  PublicActions,
  WalletClient,
  WriteContractParameters,
  WriteContractReturnType,
} from 'viem'

export interface TestnetClient extends WalletClient, PublicActions, TestnetClientHelperActions {
  setErc20Balance(tkn: Address, usr: Address, amount: bigint): Promise<void>
  setBalance(usr: Address, amount: bigint): Promise<void>
  setStorageAt(addr: Address, slot: Hash, value: string): Promise<void>
  snapshot(): Promise<string>
  revert(snapshotId: string): Promise<string> // @note: returns new snapshot id (may be the same as the input)
  mineBlocks(blocks: bigint): Promise<void>
  setNextBlockTimestamp(timestamp: bigint): Promise<void>
}

export type TestnetClientHelperActions = {
  baselineSnapshot(): Promise<void> // @note: baseline snapshot can be created only once, useful to easily revert to a known state. Helper on top of the snapshot method
  revertToBaseline(): Promise<void> // @note: revert to the baseline snapshot, helper on top of the revert method

  assertWriteContract: <
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, 'payable' | 'nonpayable'>,
    args extends ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>,
  >(
    args: WriteContractParameters<abi, functionName, args>,
  ) => Promise<WriteContractReturnType>
}

export function getUrlFromClient(client: TestnetClient): string {
  return client.transport.type === 'http' ? client.transport.url : raise('Only http transport is supported')
}
