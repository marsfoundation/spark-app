import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export type CapConfig = {
  maxCap: NormalizedUnitNumber
  gap: NormalizedUnitNumber
  increaseCooldown: number
  lastUpdateBlock: number
  lastIncreaseTime: Date
}

export type CapAutomatorInfo = Record<'supplyCap' | 'borrowCap', CapConfig | null>
