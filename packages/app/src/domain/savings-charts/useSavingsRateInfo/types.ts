import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

interface SavingsRateInfoItem {
  date: Date
  rate: NormalizedUnitNumber
}

export type SavingsRateInfo = {
  ssr: SavingsRateInfoItem[]
  dsr: SavingsRateInfoItem[]
}
