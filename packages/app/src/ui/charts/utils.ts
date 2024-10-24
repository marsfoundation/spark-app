import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Timeframe } from './defaults'

export function formatTooltipDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
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

interface FilterDataByTimeframeParams<Data extends { date: Date }> {
  data: Data[]
  timeframe: Timeframe
  currentTimestamp: number
}
export function filterDataByTimeframe<Data extends { date: Date }>({
  data,
  timeframe,
  currentTimestamp,
}: FilterDataByTimeframeParams<Data>): Data[] {
  const now = new Date(currentTimestamp * 1000)

  switch (timeframe) {
    case '7D': {
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      return data.filter((d) => new Date(d.date) >= sevenDaysAgo)
    }

    case '1M': {
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return data.filter((d) => new Date(d.date) >= oneMonthAgo)
    }

    case '1Y': {
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return data.filter((d) => new Date(d.date) >= oneYearAgo)
    }

    case 'All':
      return data
  }
}

export function getVerticalDomainWithPadding(min: number, max: number): [number, number] {
  const delta = max - min

  if (delta === 0) {
    return [min * 0.9, max * 1.1]
  }

  return [Math.max(0, min - delta * 0.1), max + delta * 0.1]
}
