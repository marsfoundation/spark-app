import { SavingsRateGraph, SavingsRateGraphProps } from './SavingsRateGraph'

export function DsrGraph(props: Omit<SavingsRateGraphProps, 'tooltipLabel'>) {
  return <SavingsRateGraph tooltipLabel="DSR" {...props} />
}
