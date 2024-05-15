import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

export interface SavingsInfo {
  predictSharesValue({ timestamp, shares }: { timestamp: number; shares: NormalizedUnitNumber }): NormalizedUnitNumber
  convertDaiToShares({ dai }: { dai: NormalizedUnitNumber }): NormalizedUnitNumber
  convertSharesToDai({ shares }: { shares: NormalizedUnitNumber }): NormalizedUnitNumber
  apy: Percentage
  supportsRealTimeInterestAccrual: boolean
}
