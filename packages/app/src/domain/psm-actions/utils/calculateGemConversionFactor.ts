import BigNumber from 'bignumber.js'
import { Token } from '../../types/Token'

interface calculateGemConversionFactorParams {
  gem: Token
  assetsToken: Token
}

export function calculateGemConversionFactor({ gem, assetsToken }: calculateGemConversionFactorParams): BigNumber {
  return BigNumber(10).pow(assetsToken.decimals - gem.decimals)
}
