import BigNumber from 'bignumber.js'

import { EModeCategoryName } from '@/domain/e-mode/types'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface PositionOverview {
  healthFactor: BigNumber | undefined
  maxLTV: Percentage
}

export interface EModeCategory {
  name: EModeCategoryName
  tokens: Token[]
  isSelected: boolean
  isActive: boolean
  onSelect: () => void
}
