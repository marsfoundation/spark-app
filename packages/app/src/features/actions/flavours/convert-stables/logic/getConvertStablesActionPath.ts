import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { Token } from '@/domain/types/Token'
import { PsmConvertActionPath, getPsmConvertActionPath } from '../../psm-convert/logic/getPsmConvertActionPath'

export type ConvertStablesActionPath = PsmConvertActionPath | 'dai-usds' | 'usds-dai'

export interface GetConvertStablesActionPathParams {
  inToken: Token
  outToken: Token
  tokenRepository: TokenRepository
  chainId: number
}

export function getConvertStablesActionPath({
  inToken,
  outToken,
  tokenRepository,
  chainId,
}: GetConvertStablesActionPathParams): ConvertStablesActionPath {
  const dai = tokenRepository.DAI?.symbol
  const usds = tokenRepository.USDS?.symbol

  if (inToken.symbol === dai && outToken.symbol === usds) {
    return 'dai-usds'
  }

  if (inToken.symbol === usds && outToken.symbol === dai) {
    return 'usds-dai'
  }

  return getPsmConvertActionPath({ inToken, outToken, tokenRepository, chainId })
}
