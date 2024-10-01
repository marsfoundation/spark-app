export type Margins = { top: number; right: number; bottom: number; left: number }
export const defaultMargins: Margins = { top: 40, right: 20, bottom: 20, left: 40 }

export const POINT_RADIUS = 4

export type Timeframe = typeof AVAILABLE_TIMEFRAMES[number]
export const AVAILABLE_TIMEFRAMES = ['7D', '1M', '1Y', 'All'] as const
