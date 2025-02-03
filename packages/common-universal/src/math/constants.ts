import BigNumber from 'bignumber.js'

// note: constants need to be functions to bypass any circular dependency issues

export function WAD(): BigNumber {
  return new BigNumber(10).pow(18)
}

export function RAY(): BigNumber {
  return new BigNumber(10).pow(27)
}

export function RAD(): BigNumber {
  return new BigNumber(10).pow(45)
}
