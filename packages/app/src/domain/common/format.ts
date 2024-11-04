import BigNumber from 'bignumber.js'

import { trimCharEnd } from '@/utils/strings'

import { bigNumberify } from '../../utils/bigNumber'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { SPK_MOCK_TOKEN } from '../types/Token'

export interface FormatPercentageOptions {
  skipSign?: boolean
  minimumFractionDigits?: number
}
export function formatPercentage(
  percentage: Percentage | undefined,
  { skipSign, minimumFractionDigits = 2 }: FormatPercentageOptions = {},
): string {
  if (percentage === undefined) {
    return '—'
  }

  if (percentage.gt(0) && percentage.lt(0.0001)) {
    return skipSign ? '<0.01' : '<0.01%'
  }

  const percentageFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits,
  })

  const value = percentage.multipliedBy(100).toNumber()
  return `${percentageFormatter.format(value)}${skipSign ? '' : '%'}`
}

const healthFactorFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})
export function formatHealthFactor(healthFactor: BigNumber | undefined): string {
  if (healthFactor === undefined) {
    return '0.0'
  }
  if (!healthFactor.isFinite()) {
    return String.fromCharCode(0x221e)
  }

  return healthFactorFormatter.format(bigNumberify(healthFactor).toNumber())
}

export function formFormat(value: BigNumber, precision = 2): string {
  const roundedValue = value.toFixed(precision, BigNumber.ROUND_DOWN)

  // avoid trailing zeroes
  // @note: we can't use a Intl.formatter here because it doesn't support rounding modes :/
  return trimCharEnd(trimCharEnd(roundedValue, '0'), '.')
}

export function findSignificantPrecision(
  _unitPriceUsd: BigNumber,
  desiredPrecisionOfUsd = 2, // 0.01 = cents
): number {
  const unitPriceUsd = Number(_unitPriceUsd)
  return Math.max(Math.floor(Math.log10(unitPriceUsd)) + desiredPrecisionOfUsd, 0)
}

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
