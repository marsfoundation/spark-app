import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface D3MInfo {
  D3MCurrentDebtUSD: NormalizedUnitNumber
  maxDebtCeiling: NormalizedUnitNumber
  gap: NormalizedUnitNumber
  increaseCooldown: number
  lastUpdateBlock: number
  lastIncreaseTimestamp: number
}
