import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'

export function formatTooltipDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const hoursString = String(hours).padStart(2, '0')

  return `${day}.${month}.${year} ${hoursString}:${minutes} ${ampm}`
}

export function formatDateTick(date: any): string {
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}

export function formatPercentageTick(value: { valueOf(): number }): string {
  const tickFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  })

  return `${tickFormatter.format(value.valueOf() * 100)}%`
}

export function formatUSDTicks(value: { valueOf(): number }): string {
  return USD_MOCK_TOKEN.formatUSD(NormalizedUnitNumber(value.valueOf()), { compact: true })
}
