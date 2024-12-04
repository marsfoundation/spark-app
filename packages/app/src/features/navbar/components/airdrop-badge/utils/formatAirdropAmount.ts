import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface FormatAirdropAmountParams {
  amount: NormalizedUnitNumber
  precision: number
  isGrowing?: boolean
}

export function formatAirdropAmount({ amount, precision, isGrowing }: FormatAirdropAmountParams): string {
  if (isGrowing) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })
    return formatter.format(amount.toNumber())
  }
  return SPK_MOCK_TOKEN.format(amount, { style: 'auto' })
}
