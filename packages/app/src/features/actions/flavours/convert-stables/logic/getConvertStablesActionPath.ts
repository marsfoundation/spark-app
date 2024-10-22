import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { PsmConvertActionPath, getPsmConvertActionPath } from '../../psm-convert/logic/getPsmConvertActionPath'

export type ConvertStablesActionPath = PsmConvertActionPath | 'dai-usds' | 'usds-dai'

export interface GetConvertStablesActionPathParams {
  inToken: Token
  outToken: Token
  tokensInfo: TokensInfo
  chainId: number
}

export function getConvertStablesActionPath({
  inToken,
  outToken,
  tokensInfo,
  chainId,
}: GetConvertStablesActionPathParams): ConvertStablesActionPath {
  const dai = tokensInfo.DAI?.symbol
  const usds = tokensInfo.USDS?.symbol

  if (inToken.symbol === dai && outToken.symbol === usds) {
    return 'dai-usds'
  }

  if (inToken.symbol === usds && outToken.symbol === dai) {
    return 'usds-dai'
  }

  return getPsmConvertActionPath({ inToken, outToken, tokensInfo, chainId })
}
