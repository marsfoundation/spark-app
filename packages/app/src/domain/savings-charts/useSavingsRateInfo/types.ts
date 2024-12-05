import { Percentage } from '@marsfoundation/common-universal'

export interface SavingsRateInfoItem {
  date: Date
  rate: Percentage
}

export type SavingsRateInfo = {
  ssr: SavingsRateInfoItem[]
  dsr: SavingsRateInfoItem[]
}
