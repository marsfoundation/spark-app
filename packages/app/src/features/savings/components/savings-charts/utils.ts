import { TokenSymbol } from '@/domain/types/TokenSymbol'

// @todo: Temporary getter. This should be added as a return of savings chart query hook.
export function getSavingsRateChartMeta(savingsTokenSymbol: TokenSymbol): {
  savingsRateTabLabel: string
  savingsRateChartTooltipLabel: string
} {
  switch (savingsTokenSymbol.toLocaleLowerCase()) {
    case 'susds':
      return {
        savingsRateTabLabel: 'Sky Savings Rate',
        savingsRateChartTooltipLabel: 'SSR',
      }
    case 'sdai':
      return {
        savingsRateTabLabel: 'DAI Savings Rate',
        savingsRateChartTooltipLabel: 'DSR',
      }
    default:
      return {
        savingsRateTabLabel: 'Savings Rate',
        savingsRateChartTooltipLabel: 'APY',
      }
  }
}
