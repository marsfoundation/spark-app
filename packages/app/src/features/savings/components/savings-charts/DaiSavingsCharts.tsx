import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { ChartTabsPanel, createChartTab } from '@/ui/charts/components/ChartTabsPanel'
import { Timeframe } from '@/ui/charts/defaults'
import { MyEarningsChart } from './components/MyEarningsChart'
import { DsrChart } from './components/savings-rate-chart/DsrChart'

interface UsdsSavingsChartsProps {
  selectedTimeframe: Timeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
}

export function DaiSavingsCharts({
  selectedTimeframe,
  setSelectedTimeframe,
  myEarningsInfo,
  savingsRateInfo,
}: UsdsSavingsChartsProps) {
  return (
    <ChartTabsPanel
      tabs={[
        ...(myEarningsInfo.shouldDisplayMyEarnings
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
          id: 'dsr',
          label: 'DSR',
          component: DsrChart,
          isError: savingsRateInfo.isError,
          isPending: savingsRateInfo.isLoading,
          props: { data: savingsRateInfo.data?.dsr ?? [] },
        }),
      ]}
      selectedTimeframe={selectedTimeframe}
      onTimeframeChange={setSelectedTimeframe}
    />
  )
}
