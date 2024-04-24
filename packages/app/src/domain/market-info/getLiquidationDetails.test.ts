import { describe } from 'vitest'

import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { testAddresses } from '@/test/integration/constants'

import { getLiquidationDetails } from './getLiquidationDetails'

describe(getLiquidationDetails.name, () => {
  describe('no existing deposits and debt', () => {
    const alreadyDeposited = {
      tokens: [],
      totalValueUSD: NormalizedUnitNumber(0),
    }
    const alreadyBorrowed = {
      tokens: [],
      totalValueUSD: NormalizedUnitNumber(0),
    }
    const tokensToBorrow = [{ token: daiLike, value: NormalizedUnitNumber(1000) }]
    const marketInfo = getMockedMarketInfo({})

    it('returns undefined when no tokens to deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [],
      })

      expect(result).toBeUndefined()
    })

    it('returns undefined when multiple tokens to deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [
          { token: ethLike, value: NormalizedUnitNumber(1) },
          { token: btcLike, value: NormalizedUnitNumber(1) },
        ],
      })

      expect(result).toBeUndefined()
    })

    it('returns correct data for a single deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        tokensToDeposit: [{ token: ethLike, value: NormalizedUnitNumber(1) }],
        marketInfo: getMockedMarketInfo({ depositToken: ethLike }),
      })

      expect(result).toStrictEqual({
        liquidationPrice: NormalizedUnitNumber(1250),
        tokenWithPrice: {
          priceInUSD: NormalizedUnitNumber(2000),
          symbol: ethLike.symbol,
        },
      })
    })
  })

  describe('existing single deposit, no debt', () => {
    const alreadyDeposited = {
      tokens: [ethLike],
      totalValueUSD: NormalizedUnitNumber(2000),
    }
    const alreadyBorrowed = {
      tokens: [],
      totalValueUSD: NormalizedUnitNumber(0),
    }
    const tokensToBorrow = [{ token: daiLike, value: NormalizedUnitNumber(1000) }]
    const marketInfo = getMockedMarketInfo({ collateralToken: ethLike, collateralBalance: '1' })

    it('returns undefined when multiple tokens to deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [
          { token: ethLike, value: NormalizedUnitNumber(1) },
          { token: btcLike, value: NormalizedUnitNumber(1) },
        ],
      })

      expect(result).toBeUndefined()
    })

    it('returns correct data for a single deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [{ token: ethLike, value: NormalizedUnitNumber(1) }],
      })

      expect(result).toStrictEqual({
        liquidationPrice: NormalizedUnitNumber(625),
        tokenWithPrice: {
          priceInUSD: NormalizedUnitNumber(2000),
          symbol: ethLike.symbol,
        },
      })
    })

    it('returns correct data when no new deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [],
      })

      expect(result).toStrictEqual({
        liquidationPrice: NormalizedUnitNumber(1250),
        tokenWithPrice: {
          priceInUSD: NormalizedUnitNumber(2000),
          symbol: ethLike.symbol,
        },
      })
    })
  })

  describe('existing multiple deposits, no debt', () => {
    const alreadyDeposited = {
      tokens: [ethLike, btcLike],
      totalValueUSD: NormalizedUnitNumber(42000),
    }
    const alreadyBorrowed = {
      tokens: [],
      totalValueUSD: NormalizedUnitNumber(0),
    }
    const tokensToBorrow = [{ token: daiLike, value: NormalizedUnitNumber(1000) }]
    const marketInfo = getMockedMarketInfo({})

    it('returns undefined when multiple deposits', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [{ token: ethLike, value: NormalizedUnitNumber(1) }],
      })

      expect(result).toBeUndefined()
    })
  })

  describe('existing multiple asset debt', () => {
    const alreadyDeposited = {
      tokens: [],
      totalValueUSD: NormalizedUnitNumber(0),
    }
    const alreadyBorrowed = {
      tokens: [daiLike, ethLike],
      totalValueUSD: NormalizedUnitNumber(1000),
    }
    const tokensToBorrow = [{ token: daiLike, value: NormalizedUnitNumber(1000) }]
    const marketInfo = getMockedMarketInfo({})

    it('returns undefined when debt in multiple assets', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [{ token: ethLike, value: NormalizedUnitNumber(1) }],
      })

      expect(result).toBeUndefined()
    })
  })

  describe('existing single deposit, has debt in dai', () => {
    const alreadyDeposited = {
      tokens: [ethLike],
      totalValueUSD: NormalizedUnitNumber(2000),
    }
    const alreadyBorrowed = {
      tokens: [daiLike],
      totalValueUSD: NormalizedUnitNumber(1000),
    }
    const tokensToBorrow = [{ token: daiLike, value: NormalizedUnitNumber(500) }]
    const marketInfo = getMockedMarketInfo({ collateralToken: ethLike, collateralBalance: '1' })

    it('returns undefined when multiple tokens to deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [
          { token: ethLike, value: NormalizedUnitNumber(1) },
          { token: btcLike, value: NormalizedUnitNumber(1) },
        ],
      })

      expect(result).toBeUndefined()
    })

    it('returns undefined when new single deposit is different than already deposited', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [{ token: btcLike, value: NormalizedUnitNumber(1) }],
      })

      expect(result).toBeUndefined()
    })

    it('returns correct data if no new deposit', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [],
      })

      expect(result).toStrictEqual({
        liquidationPrice: NormalizedUnitNumber(1875),
        tokenWithPrice: {
          priceInUSD: NormalizedUnitNumber(2000),
          symbol: ethLike.symbol,
        },
      })
    })

    it('returns correct data if new deposit same as already deposited', () => {
      const result = getLiquidationDetails({
        alreadyDeposited,
        alreadyBorrowed,
        tokensToBorrow,
        marketInfo,
        tokensToDeposit: [{ token: ethLike, value: NormalizedUnitNumber(1) }],
      })

      expect(result).toStrictEqual({
        liquidationPrice: NormalizedUnitNumber(937.5),
        tokenWithPrice: {
          priceInUSD: NormalizedUnitNumber(2000),
          symbol: ethLike.symbol,
        },
      })
    })
  })
})

interface GetMockedMarketInfoOptions {
  collateralBalance?: string
  collateralToken?: Token
  liquidationThreshold?: string
  depositToken?: Token
}

function getMockedMarketInfo({
  collateralBalance = '0',
  liquidationThreshold = '0.8',
  depositToken = ethLike,
  collateralToken = ethLike,
}: GetMockedMarketInfoOptions): MarketInfo {
  return {
    // used to get data about existing deposits
    findOnePositionBySymbol: () => ({
      collateralBalance: NormalizedUnitNumber(collateralBalance),
      reserve: {
        liquidationThreshold: NormalizedUnitNumber(liquidationThreshold),
        priceInUSD: NormalizedUnitNumber(depositToken.unitPriceUsd),
        token: depositToken,
      },
    }),
    // used to get data about the token to deposit
    findOneReserveBySymbol: () => ({
      liquidationThreshold: NormalizedUnitNumber(liquidationThreshold),
      priceInUSD: NormalizedUnitNumber(collateralToken.unitPriceUsd),
      token: collateralToken,
    }),
  } as unknown as MarketInfo
}

const address = testAddresses.token
const ethLike = new Token({
  address,
  symbol: TokenSymbol('ETH'),
  decimals: 18,
  name: 'ETH Token',
  unitPriceUsd: '2000',
})
const btcLike = new Token({
  address,
  symbol: TokenSymbol('BTC'),
  decimals: 18,
  name: 'BTC Token',
  unitPriceUsd: '40000',
})
const daiLike = new Token({
  address,
  symbol: TokenSymbol('DAI'),
  decimals: 18,
  name: 'DAI Token',
  unitPriceUsd: '1',
})
