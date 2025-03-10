import { Page, expect } from '@playwright/test'
import { Abi, ContractFunctionName, ContractFunctionParameters, encodeFunctionData } from 'viem'
import { __TX_LIST_KEY } from './constants'

export interface TestTokenWithValue {
  asset: string
  amount: string
  usdValue: string
}

export function expectAssets(summary: string, assets: TestTokenWithValue[]): void {
  for (const asset of assets) {
    expect(summary).toMatch(`${asset.asset}${asset.amount}${asset.usdValue}`)
  }
}

export async function expectTransactionToBeSent<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi>,
>(page: Page, parameters: ContractFunctionParameters<TAbi, 'nonpayable' | 'payable', TFunctionName>): Promise<void> {
  const { abi, functionName, args, ...rest } = parameters
  const calldata = encodeFunctionData(parameters as any)
  const sanitizedParameters = { calldata, ...rest }

  const txList: any[] = (await page.evaluate((__TX_LIST_KEY) => {
    return window[__TX_LIST_KEY]
  }, __TX_LIST_KEY)) as any

  const matchingTx = txList.find((tx: any) => {
    return Object.entries(sanitizedParameters).every(([key, value]) => {
      return tx[key] === value
    })
  })

  expect(matchingTx, 'Transaction not found').toBeTruthy()
}
