import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

export interface FarmHistoryItem {
  date: Date
  apr: Percentage
  totalStaked: NormalizedUnitNumber
}
