import { Timeframe } from '@/ui/charts/defaults'

export const MY_EARNINGS_TIMEFRAMES = ['1M', '1Y', '3Y', 'All'] as const satisfies Timeframe[]
export type MyEarningsTimeframe = (typeof MY_EARNINGS_TIMEFRAMES)[number]
