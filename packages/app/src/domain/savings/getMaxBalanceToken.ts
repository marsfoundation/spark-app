import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'

export interface GetMaxBalanceTokenParams {
  assets: TokenWithBalance[]
}

export interface GetMaxBalanceTokenResult {
  maxBalanceToken: TokenWithBalance
  totalUSD: NormalizedUnitNumber
}

export function getMaxBalanceToken({ assets }: GetMaxBalanceTokenParams): GetMaxBalanceTokenResult {
  const totalUSD = NormalizedUnitNumber(
    assets.reduce((acc, { token, balance }) => acc.plus(token.toUSD(balance)), bigNumberify('0')),
  )
  const maxBalanceToken = assets.reduce((acc, token) => (token.balance.gt(acc.balance) ? token : acc), assets[0]!)

  return { totalUSD, maxBalanceToken }
}
