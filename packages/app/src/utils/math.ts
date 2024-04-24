import { BigNumberValue, valueToBigNumber } from '@aave/math-utils'
import BigNumber from 'bignumber.js'

export function toWad(value: BigNumberValue): BigNumber {
  return valueToBigNumber(value).shiftedBy(18)
}

export function fromWad(value: BigNumberValue): BigNumber {
  return valueToBigNumber(value).shiftedBy(-18)
}

export function toRay(value: BigNumberValue): BigNumber {
  return valueToBigNumber(value).shiftedBy(27)
}

export function fromRay(value: BigNumberValue): BigNumber {
  return valueToBigNumber(value).shiftedBy(-27)
}

export function toRad(value: BigNumberValue): BigNumber {
  return valueToBigNumber(value).shiftedBy(45)
}

export function fromRad(value: BigNumberValue): BigNumber {
  return valueToBigNumber(value).shiftedBy(-45)
}

// is needed because setting POW_PRECISION to 100 before the operation doesn't work in node
export function pow(a: BigNumberValue, b: BigNumberValue): BigNumber {
  return BigNumber.clone({ POW_PRECISION: 100 }).prototype.pow.apply(a, [new BigNumber(b).toNumber()])
}
