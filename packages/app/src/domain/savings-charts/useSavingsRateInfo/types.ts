import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface SavingsRateInfoItem {
  date: Date
  rate: NormalizedUnitNumber
}

export type SavingsRateInfo = {
  ssr: SavingsRateInfoItem[]
  dsr: SavingsRateInfoItem[]
}
