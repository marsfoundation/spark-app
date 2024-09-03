import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface CapConfig {
  maxCap: NormalizedUnitNumber
  gap: NormalizedUnitNumber
  increaseCooldown: number
  lastUpdateBlock: number
  lastIncreaseTimestamp: number
}

export interface CapAutomatorInfo {
  supplyCap?: CapConfig
  borrowCap?: CapConfig
}
