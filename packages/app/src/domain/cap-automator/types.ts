import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface CapConfig {
  maxCap: NormalizedUnitNumber
  gap: NormalizedUnitNumber
  increaseCooldown: number
  lastUpdateBlock: number
  lastIncreaseTime: number
}

export interface CapAutomatorInfo {
  supplyCap: CapConfig | null
  borrowCap: CapConfig | null
}
