import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { ChartTabsPanel, createChartTab } from '@/ui/charts/components/ChartTabsPanel'
import { MyEarningsChart } from './components/MyEarningsChart'
import { DsrChart } from './components/savings-rate-chart/DsrChart'

interface UsdsSavingsChartsProps {
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
}

export function DaiSavingsCharts({ myEarningsInfo, savingsRateInfo }: UsdsSavingsChartsProps) {
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
                availableTimeframes: myEarningsInfo.availableTimeframes,
                setSelectedTimeframe: myEarningsInfo.setSelectedTimeframe,
                selectedTimeframe: myEarningsInfo.selectedTimeframe,
              }),
            ]
          : []),
        createChartTab({
          id: 'dsr',
          label: 'Dai Savings Rate',
          component: DsrChart,
          isError: savingsRateInfo.queryResult.isError,
          isPending: savingsRateInfo.queryResult.isPending,
          props: { data: savingsRateInfo.queryResult.data?.dsr ?? [] },
          availableTimeframes: savingsRateInfo.availableTimeframes,
          setSelectedTimeframe: savingsRateInfo.setSelectedTimeframe,
          selectedTimeframe: savingsRateInfo.selectedTimeframe,
        }),
      ]}
    />
  )
}
