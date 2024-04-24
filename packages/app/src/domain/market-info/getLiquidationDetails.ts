import BigNumber from 'bignumber.js'

import { TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { Token } from '../types/Token'

export interface LiquidationDetails {
  liquidationPrice: NormalizedUnitNumber
  tokenWithPrice: {
    priceInUSD: NormalizedUnitNumber
    symbol: TokenSymbol
  }
}

interface ExistingPosition {
  tokens: Token[]
  totalValueUSD: NormalizedUnitNumber
}

interface GetLiquidationDetailsParams {
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  tokensToDeposit: TokenWithValue[]
  tokensToBorrow: TokenWithValue[]
  marketInfo: MarketInfo
}

export function getLiquidationDetails({
  alreadyDeposited,
  alreadyBorrowed,
  tokensToDeposit,
  tokensToBorrow,
  marketInfo,
}: GetLiquidationDetailsParams): LiquidationDetails | undefined {
  const depositsCount = tokensToDeposit.length
  const alreadyBorrowedCount = alreadyBorrowed.tokens.length
  const alreadyDepositedCount = alreadyDeposited.tokens.length
  const depositTokenSymbol = tokensToDeposit[0]?.token.symbol

  // collateral checks
  const hasDepositOrCollateral = depositsCount !== 0 || alreadyDepositedCount !== 0
  const hasNoDepositButSingleCollateral = depositsCount === 0 && alreadyDepositedCount === 1
  const hasSingleDepositButNoCollateral = depositsCount === 1 && alreadyDepositedCount === 0
  const hasSingleDepositSameAsSingleCollateral =
    depositsCount === 1 && alreadyDepositedCount === 1 && depositTokenSymbol === alreadyDeposited.tokens[0]?.symbol

  const depositCheck =
    hasDepositOrCollateral ||
    hasNoDepositButSingleCollateral ||
    hasSingleDepositButNoCollateral ||
    hasSingleDepositSameAsSingleCollateral

  // checking that debt is Dai or there is no debt
  const hasNoDebt = alreadyBorrowedCount === 0
  const hasOnlyDaiDebt = alreadyBorrowedCount === 1 && alreadyBorrowed.tokens[0]?.symbol === TokenSymbol('DAI')
  const borrowCheck = hasNoDebt || hasOnlyDaiDebt

  if (!depositCheck || !borrowCheck) {
    return undefined
  }

  // From here we have conditions that are viable to calculate liquidation price

  const tokenToBorrowUSDValue = tokensToBorrow[0]?.value.multipliedBy(tokensToBorrow[0].token.unitPriceUsd) ?? 0
  const borrowInUSD = NormalizedUnitNumber(alreadyBorrowed.totalValueUSD.plus(tokenToBorrowUSDValue))

  if (hasNoDepositButSingleCollateral) {
    const collateralToken = alreadyDeposited.tokens[0]!
    const collateralPosition = marketInfo.findOnePositionBySymbol(collateralToken.symbol)
    const liquidationPrice = calculateLiquidationPrice({
      borrowInUSD,
      depositAmount: collateralPosition.collateralBalance,
      liquidationThreshold: collateralPosition.reserve.liquidationThreshold,
    })

    return {
      liquidationPrice,
      tokenWithPrice: {
        priceInUSD: NormalizedUnitNumber(collateralPosition.reserve.priceInUSD),
        symbol: collateralPosition.reserve.token.symbol,
      },
    }
  }

  if (hasSingleDepositButNoCollateral) {
    const deposit = tokensToDeposit[0]!
    const depositReserve = marketInfo.findOneReserveBySymbol(depositTokenSymbol!)
    const liquidationPrice = calculateLiquidationPrice({
      borrowInUSD,
      depositAmount: deposit.value,
      liquidationThreshold: depositReserve.liquidationThreshold,
    })

    return {
      liquidationPrice,
      tokenWithPrice: {
        priceInUSD: NormalizedUnitNumber(depositReserve.priceInUSD),
        symbol: depositReserve.token.symbol,
      },
    }
  }

  if (hasSingleDepositSameAsSingleCollateral) {
    const deposit = tokensToDeposit[0]!
    const collateralToken = alreadyDeposited.tokens[0]!
    const collateral = marketInfo.findOnePositionBySymbol(collateralToken.symbol)
    const totalDepositValue = deposit.value.plus(collateral.collateralBalance)
    const liquidationPrice = calculateLiquidationPrice({
      borrowInUSD,
      depositAmount: totalDepositValue,
      liquidationThreshold: collateral.reserve.liquidationThreshold,
    })

    return {
      liquidationPrice,
      tokenWithPrice: {
        priceInUSD: NormalizedUnitNumber(collateral.reserve.priceInUSD),
        symbol: collateral.reserve.token.symbol,
      },
    }
  }
}

interface CalculateLiquidationPriceArguments {
  borrowInUSD: BigNumber
  depositAmount: BigNumber
  liquidationThreshold: Percentage
}

function calculateLiquidationPrice({
  borrowInUSD,
  depositAmount,
  liquidationThreshold,
}: CalculateLiquidationPriceArguments): NormalizedUnitNumber {
  const denominator = depositAmount.multipliedBy(liquidationThreshold)
  if (denominator.isZero()) {
    return NormalizedUnitNumber(0)
  }

  const liquidationPrice = borrowInUSD.dividedBy(denominator)
  return NormalizedUnitNumber(liquidationPrice)
}
