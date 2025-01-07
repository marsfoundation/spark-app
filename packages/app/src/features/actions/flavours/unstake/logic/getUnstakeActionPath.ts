import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@marsfoundation/common-universal'

export type UnstakeActionPath = 'farm-to-usds' | 'farm-to-usds-to-usdc' | 'farm-to-usds-to-dai'

export interface GetUnstakeActionPathParams {
  token: Token
  tokensInfo: TokensInfo
  stakingToken: Token
}

export function getUnstakeActionPath({
  token,
  tokensInfo,
  stakingToken,
}: GetUnstakeActionPathParams): UnstakeActionPath {
  if (stakingToken.symbol === tokensInfo.USDS?.symbol) {
    if (token.symbol === tokensInfo.USDS?.symbol) {
      return 'farm-to-usds'
    }

    if (token.symbol === TokenSymbol('USDC')) {
      return 'farm-to-usds-to-usdc'
    }

    if (token.symbol === tokensInfo.DAI?.symbol) {
      return 'farm-to-usds-to-dai'
    }
  }

  raise('Farm withdraw action type not recognized')
}
