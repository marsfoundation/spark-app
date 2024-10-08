import { SavingsRateChart, SavingsRateChartProps } from './SavingsRateChart'

export function SsrChart(props: Omit<SavingsRateChartProps, 'tooltipLabel'>) {
  return <SavingsRateChart tooltipLabel="SSR" {...props} />
}
