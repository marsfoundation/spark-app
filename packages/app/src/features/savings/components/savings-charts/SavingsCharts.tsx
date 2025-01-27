import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { ChartTabsPanel, createChartTab } from '@/ui/charts/components/ChartTabsPanel'
import { MyEarningsChart } from './components/MyEarningsChart'
import { SavingsRateChart } from './components/SavingsRateChart'

interface SavingsChartsProps {
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
  savingsRateTabLabel: string
  savingsRateChartTooltipLabel: string
}

export function SavingsCharts({
  myEarningsInfo,
  savingsRateInfo,
  savingsRateTabLabel,
  savingsRateChartTooltipLabel,
}: SavingsChartsProps) {
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
          id: 'savings-rate',
          label: savingsRateTabLabel,
          component: SavingsRateChart,
          isError: savingsRateInfo.queryResult.isError,
          isPending: savingsRateInfo.queryResult.isPending,
          props: { data: savingsRateInfo.queryResult.data?.ssr ?? [], tooltipLabel: savingsRateChartTooltipLabel },
          availableTimeframes: savingsRateInfo.availableTimeframes,
          setSelectedTimeframe: savingsRateInfo.setSelectedTimeframe,
          selectedTimeframe: savingsRateInfo.selectedTimeframe,
        }),
      ]}
    />
  )
}
