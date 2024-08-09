import BigNumber from 'bignumber.js'

interface calculateGemConversionFactorParams {
  gemDecimals: number
  assetsTokenDecimals: number
}

export function calculateGemConversionFactor({
  gemDecimals,
  assetsTokenDecimals,
}: calculateGemConversionFactorParams): BigNumber {
  return BigNumber(10).pow(assetsTokenDecimals - gemDecimals)
}
