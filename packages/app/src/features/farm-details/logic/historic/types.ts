import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

export interface FarmHistoryItem {
  date: Date
  apr: Percentage
  totalStaked: NormalizedUnitNumber
}
