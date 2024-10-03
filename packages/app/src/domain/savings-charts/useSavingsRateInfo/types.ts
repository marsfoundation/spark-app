import { Percentage } from '@/domain/types/NumericValues'

export interface SavingsRateInfoItem {
  date: Date
  rate: Percentage
}

export type SavingsRateInfo = {
  ssr: SavingsRateInfoItem[]
  dsr: SavingsRateInfoItem[]
}
