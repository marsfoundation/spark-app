import { NormalizedUnitNumber } from '../types/NumericValues'

export interface D3MInfo {
  D3MCurrentDebtUSD: NormalizedUnitNumber
  maxDebtCeiling: NormalizedUnitNumber
  gap: NormalizedUnitNumber
  increaseCooldown: number
  lastUpdateBlock: number
  lastIncreaseTimestamp: number
}
