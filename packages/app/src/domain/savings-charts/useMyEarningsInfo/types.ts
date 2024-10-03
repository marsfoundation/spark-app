import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface MyEarningsInfoDataItem {
  date: Date
  balance: {
    sdai: NormalizedUnitNumber
    susds: NormalizedUnitNumber
  }
}

export interface MyEarningsInfoItem {
  date: Date
  balance: NormalizedUnitNumber
}
