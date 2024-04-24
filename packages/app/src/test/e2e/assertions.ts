import { expect } from '@playwright/test'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'

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
