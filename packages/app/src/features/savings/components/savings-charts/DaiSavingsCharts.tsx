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
                isError: myEarningsInfo.queryResult.isError,
                isPending: myEarningsInfo.queryResult.isPending,
                props: {
                  data: myEarningsInfo.queryResult.data?.data ?? [],
                  predictions: myEarningsInfo.queryResult.data?.predictions ?? [],
                },
              }),
            ]
          : []),
        createChartTab({
          id: 'dsr',
          label: 'Dai Savings Rate',
          component: DsrChart,
          isError: savingsRateInfo.isError,
          isPending: savingsRateInfo.isPending,
          props: { data: savingsRateInfo.data?.dsr ?? [] },
        }),
      ]}
      selectedTimeframe={selectedTimeframe}
      onTimeframeChange={setSelectedTimeframe}
    />
  )
}
