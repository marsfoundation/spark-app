import { PotParams } from '@/domain/maker-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRay, pow } from '@/utils/math'

import { Projections } from '../types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculateProjectionsParams {
  timestamp: number // in seconds
  shares: NormalizedUnitNumber
  potParams: PotParams
}
export function calculateProjections({ timestamp, shares, potParams }: CalculateProjectionsParams): Projections {
  const base = convertSharesToDai({ timestamp, shares, potParams })
  const thirtyDays = NormalizedUnitNumber(
    convertSharesToDai({ timestamp: timestamp + 30 * SECONDS_PER_DAY, shares, potParams }).minus(base),
  )
  const oneYear = NormalizedUnitNumber(
    convertSharesToDai({ timestamp: timestamp + 365 * SECONDS_PER_DAY, shares, potParams }).minus(base),
  )

  return {
    thirtyDays,
    oneYear,
  }
}

export interface ConvertSharesToDaiParams {
  timestamp: number
  shares: NormalizedUnitNumber
  potParams: PotParams
}
export function convertSharesToDai({ timestamp, shares, potParams }: CalculateProjectionsParams): NormalizedUnitNumber {
  const { dsr, rho, chi } = potParams
  const updatedChi = fromRay(pow(fromRay(dsr), bigNumberify(timestamp).minus(rho)).multipliedBy(chi))
  return NormalizedUnitNumber(shares.multipliedBy(updatedChi))
}

export interface ConvertDaiToShareParams {
  timestamp: number
  dai: NormalizedUnitNumber
  potParams: PotParams
}
export function convertDaiToShares({ timestamp, dai, potParams }: ConvertDaiToShareParams): NormalizedUnitNumber {
  const { dsr, rho, chi } = potParams
  const updatedChi = fromRay(pow(fromRay(dsr), bigNumberify(timestamp).minus(rho)).multipliedBy(chi))
  return NormalizedUnitNumber(dai.dividedBy(updatedChi))
}
