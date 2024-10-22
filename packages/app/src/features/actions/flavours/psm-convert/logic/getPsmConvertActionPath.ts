import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@/utils/assert'

export type PsmConvertActionPath = 'dai-usdc' | 'usdc-dai' | 'usdc-usds' | 'usds-usdc'
// | 'base-usdc-usds'
// | 'base-usds-usdc'

export interface GetPsmConvertActionPathParams {
  inToken: Token
  outToken: Token
  tokensInfo: TokensInfo
  chainId: number
}

export function getPsmConvertActionPath({
  inToken,
  outToken,
  tokensInfo,
  // chainId,
}: { inToken: Token; outToken: Token; tokensInfo: TokensInfo; chainId: number }): PsmConvertActionPath {
  const dai = tokensInfo.DAI?.symbol
  const usdc = TokenSymbol('USDC')
  const usds = tokensInfo.USDS?.symbol

  // if (chainId === base.id) {
  //   if (inToken.symbol === usdc && outToken.symbol === usds) {
  //     return 'base-usdc-usds'
  //   }

  //   if (inToken.symbol === usds && outToken.symbol === usdc) {
  //     return 'base-usds-usdc'
  //   }
  // }

  if (inToken.symbol === dai && outToken.symbol === usdc) {
    return 'dai-usdc'
  }

  if (inToken.symbol === usdc && outToken.symbol === dai) {
    return 'usdc-dai'
  }

  if (inToken.symbol === usdc && outToken.symbol === usds) {
    return 'usdc-usds'
  }

  if (inToken.symbol === usds && outToken.symbol === usdc) {
    return 'usds-usdc'
  }

  raise('Psm convert action type not recognized')
}
