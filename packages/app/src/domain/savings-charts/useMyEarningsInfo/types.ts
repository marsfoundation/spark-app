import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

interface MyEarningsInfoItem {
  date: Date
  balance: NormalizedUnitNumber
  sdaiBalance: NormalizedUnitNumber
  susdsBalance: NormalizedUnitNumber
}

export type MyEarningsInfo = MyEarningsInfoItem[]
