import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { Token } from '@/domain/types/Token'
import { ChartTabsPanel, createChartTab } from '@/ui/charts/components/ChartTabsPanel'
import { MyEarningsChart } from './components/MyEarningsChart'
import { SavingsRateChart } from './components/SavingsRateChart'

interface SavingsChartsProps {
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
  savingsToken: Token
}

export function SavingsCharts({ myEarningsInfo, savingsRateInfo, savingsToken }: SavingsChartsProps) {
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
          label: 'Savings Rate',
          component: SavingsRateChart,
          isError: savingsRateInfo.queryResult.isError,
          isPending: savingsRateInfo.queryResult.isPending,
          props: {
            data: savingsRateInfo.queryResult.data?.apy ?? [],
            tooltipLabel: 'Savings Rate',
            savingsToken,
          },
          availableTimeframes: savingsRateInfo.availableTimeframes,
          setSelectedTimeframe: savingsRateInfo.setSelectedTimeframe,
          selectedTimeframe: savingsRateInfo.selectedTimeframe,
        }),
      ]}
    />
  )
}
