import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

import { ActionRowVariant } from './types'

export function getFormattedValue(value: NormalizedUnitNumber, token: Token, variant: ActionRowVariant): string {
  const formattedValue = token.format(value, { style: 'auto' })
  const includeAmount = variant === 'extended'
  if (includeAmount) {
    return `${formattedValue} ${token.symbol}`
  }
  return token.symbol
}
