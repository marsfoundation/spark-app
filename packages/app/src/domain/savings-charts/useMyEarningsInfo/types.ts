import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface MyEarningsInfoDataItem {
  date: Date
  balance: NormalizedUnitNumber
  sdai: NormalizedUnitNumber
  susds: NormalizedUnitNumber
}

export interface MyEarningsInfoItem {
  date: Date
  balance: NormalizedUnitNumber
}
