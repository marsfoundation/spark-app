import { expect } from 'earl'
import { BaseUnitNumber } from '../types/BaseUnitNumber'
import { NormalizedUnitNumber } from '../types/NormalizedUnitNumber'
import { RAD, RAY, WAD } from './constants'

describe('constants', () => {
  it('work with NormalizedUnitNumbers', () => {
    expect(BaseUnitNumber.toNormalizedUnit(WAD, 18)).toEqual(NormalizedUnitNumber(1))
    expect(BaseUnitNumber.toNormalizedUnit(RAY, 27)).toEqual(NormalizedUnitNumber(1))
    expect(BaseUnitNumber.toNormalizedUnit(RAD, 45)).toEqual(NormalizedUnitNumber(1))
  })
})
