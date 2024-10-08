import { SavingsRateChart, SavingsRateChartProps } from './SavingsRateChart'

export function DsrChart(props: Omit<SavingsRateChartProps, 'tooltipLabel'>) {
  return <SavingsRateChart tooltipLabel="DSR" {...props} />
}
