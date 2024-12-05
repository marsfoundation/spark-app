import { tokens } from '@sb/tokens'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { sortByUsdValue } from './sorters'

describe(sortByUsdValue, () => {
  it('should sort by increasing usd value', () => {
    const balances = [
      { token: tokens.DAI, balance: NormalizedUnitNumber('4000') },
      { token: tokens.USDC, balance: NormalizedUnitNumber('100') },
      { token: tokens.ETH, balance: NormalizedUnitNumber('1') }, // ~2000 USD
    ]

    const sortedBalances = balances.sort((a, b) => sortByUsdValue(a, b, 'balance'))

    expect(sortedBalances.map((s) => s.token.symbol)).toStrictEqual(['USDC', 'ETH', 'DAI'])
  })

  it.skip("[TYPE LEVEL] should not be able to pick a key that value doesn't extend BigNumber", () => {
    // @ts-expect-error
    sortByUsdValue({ token: tokens.DAI, value: 5 }, { token: tokens.ETH, value: 10 }, 'value')
  })
})
