import BigNumber from 'bignumber.js'

export function calculateGemConversionFactor({
  gemDecimals,
  assetsTokenDecimals,
}: { gemDecimals: number; assetsTokenDecimals: number }): BigNumber {
  return BigNumber(10).pow(assetsTokenDecimals - gemDecimals)
}
