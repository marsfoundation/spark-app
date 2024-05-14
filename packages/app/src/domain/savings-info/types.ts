import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

export interface Savings {
  predictSDaiValue({ timestamp, sdai }: { timestamp: number; sdai: NormalizedUnitNumber }): NormalizedUnitNumber
  convertDaiToSDai({ sdai }: { sdai: NormalizedUnitNumber }): NormalizedUnitNumber
  convertSDaiToDai({ dai }: { dai: NormalizedUnitNumber }): NormalizedUnitNumber
  apy(): Percentage
  supportsRealTimeInterestAccrual: boolean
}
