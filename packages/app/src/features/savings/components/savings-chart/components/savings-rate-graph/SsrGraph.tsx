import { SavingsRateGraph, SavingsRateGraphProps } from './SavingsRateGraph'

export function SsrGraph(props: Omit<SavingsRateGraphProps, 'tooltipLabel'>) {
  return <SavingsRateGraph tooltipLabel="SSR" {...props} />
}
