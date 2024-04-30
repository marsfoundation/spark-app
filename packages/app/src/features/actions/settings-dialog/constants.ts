import { Percentage } from '@/domain/types/NumericValues'

export const DEFAULT_SLIPPAGE = Percentage(0.005)
export const PREDEFINED_SLIPPAGES = [Percentage(0.001), DEFAULT_SLIPPAGE, Percentage(0.01)] as const
