import { Timeframe } from '@/ui/charts/defaults'

export const MY_EARNINGS_TIMEFRAMES = ['7D', '1M', '1Y', 'All'] as const satisfies Timeframe[]
export type MyEarningsTimeframe = (typeof MY_EARNINGS_TIMEFRAMES)[number]
