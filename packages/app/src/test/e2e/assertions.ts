import { Page, expect } from '@playwright/test'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Abi, ContractFunctionName, ContractFunctionParameters, encodeFunctionData } from 'viem'
import { __TX_LIST_KEY } from './constants'

export interface TestTokenWithValue {
  asset: string
  amount: number
}

export function expectAssets(summary: string, assets: TestTokenWithValue[], assetsWorth: Record<string, number>): void {
  for (const asset of assets) {
    const worth = assetsWorth[asset.asset]!
    const amountFormatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 18, // 18 is the maximum number of decimals for a token
    }).format(asset.amount)
    const usdValueFormatted = USD_MOCK_TOKEN.formatUSD(NormalizedUnitNumber(worth))

    expect(summary).toMatch(`${asset.asset}${amountFormatted}${usdValueFormatted}`)
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
