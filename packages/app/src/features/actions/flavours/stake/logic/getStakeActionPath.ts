import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@/utils/assert'

export type StakeActionPath =
  | 'usds-to-farm'
  | 'usdc-to-usds-to-farm'
  | 'dai-to-usds-to-farm'
  | 'susds-to-usds-to-farm'
  | 'sdai-to-usds-to-farm'

export interface GetStakeActionPathParams {
  token: Token
  tokensInfo: TokensInfo
  stakingToken: Token
}

export function getStakeActionPath({ token, tokensInfo, stakingToken }: GetStakeActionPathParams): StakeActionPath {
  if (stakingToken.symbol === tokensInfo.USDS?.symbol) {
    if (token.symbol === tokensInfo.USDS?.symbol) {
      return 'usds-to-farm'
    }

    if (token.symbol === TokenSymbol('USDC')) {
      return 'usdc-to-usds-to-farm'
    }

    if (token.symbol === tokensInfo.DAI?.symbol) {
      return 'dai-to-usds-to-farm'
    }

    if (token.symbol === tokensInfo.sUSDS?.symbol) {
      return 'susds-to-usds-to-farm'
    }

    if (token.symbol === tokensInfo.sDAI?.symbol) {
      return 'sdai-to-usds-to-farm'
    }
  }

  raise('Farm deposit action type not recognized')
}
