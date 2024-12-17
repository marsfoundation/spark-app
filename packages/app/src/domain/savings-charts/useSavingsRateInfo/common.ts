import { Timeframe } from '@/ui/charts/defaults'

export const SAVINGS_RATE_TIMEFRAMES = ['1M', '3M', '1Y', 'All'] as const satisfies Timeframe[]
export type SavingsRateTimeframe = (typeof SAVINGS_RATE_TIMEFRAMES)[number]
