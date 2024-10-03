import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { ChartTabsPanel, createChartTab } from '@/ui/charts/components/ChartTabsPanel'
import { Timeframe } from '@/ui/charts/defaults'
import { MyEarningsChart } from './components/MyEarningsChart'
import { SsrChart } from './components/savings-rate-chart/SsrChart'

interface UsdsSavingsChartsProps {
  selectedTimeframe: Timeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
}

export function UsdsSavingsCharts({
  selectedTimeframe,
  setSelectedTimeframe,
  myEarningsInfo,
  savingsRateInfo,
}: UsdsSavingsChartsProps) {
  const shouldDisplayMyEarnings =
    !myEarningsInfo.isError && !myEarningsInfo.isLoading && (myEarningsInfo.data?.data?.length ?? 0) > 0

  return (
    <ChartTabsPanel
      tabs={[
        ...(shouldDisplayMyEarnings
          ? [
              createChartTab({
                id: 'my-earnings',
                label: 'My Earnings',
                component: MyEarningsChart,
                isError: myEarningsInfo.isError,
                isPending: myEarningsInfo.isLoading,
                props: { data: myEarningsInfo.data?.data ?? [], predictions: myEarningsInfo.data?.predictions ?? [] },
              }),
            ]
          : []),
        createChartTab({
          id: 'ssr',
          label: 'SSR',
          component: SsrChart,
          isError: savingsRateInfo.isError,
          isPending: savingsRateInfo.isLoading,
          props: { data: savingsRateInfo.data?.ssr ?? [] },
        }),
      ]}
      selectedTimeframe={selectedTimeframe}
      onTimeframeChange={setSelectedTimeframe}
    />
  )
}
