import { MY_EARNINGS_TIMEFRAMES } from '@/domain/savings-charts/useMyEarningsInfo/common'
import { SAVINGS_RATE_TIMEFRAMES } from '@/domain/savings-charts/useSavingsRateInfo/common'
import { MyEarningsChart } from '@/features/savings/components/savings-charts/components/MyEarningsChart'
import { SavingsRateChart } from '@/features/savings/components/savings-charts/components/SavingsRateChart'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '@/features/savings/components/savings-charts/fixtures/mockEarningsChartData'
import { mockDsrChartData } from '@/features/savings/components/savings-charts/fixtures/mockSavingsRateChartData'
import { tokens } from '@sb/tokens'
import { createChartTab } from '../components/ChartTabsPanel'

export const mockChartsPanelMultipleTabs = [
  createChartTab({
    id: 'earnings',
    label: 'My Earnings',
    component: MyEarningsChart,
    isError: false,
    isPending: false,
    props: { data: mockEarningsChartData, predictions: mockEarningsPredictionsChartData },
    selectedTimeframe: '1M' as const,
    setSelectedTimeframe: () => {},
    availableTimeframes: MY_EARNINGS_TIMEFRAMES,
  }),
  createChartTab({
    id: 'savings-rate',
    label: 'Savings Rate',
    component: SavingsRateChart,
    isError: false,
    isPending: false,
    props: { data: mockDsrChartData, tooltipLabel: 'Savings Rate', savingsToken: tokens.sDAI },
    selectedTimeframe: '1M' as const,
    setSelectedTimeframe: () => {},
    availableTimeframes: SAVINGS_RATE_TIMEFRAMES,
  }),
]

export const mockChartsPanelSingleTab = [
  createChartTab({
    id: 'earnings',
    label: 'My Earnings',
    component: MyEarningsChart,
    isError: false,
    isPending: false,
    props: { data: mockEarningsChartData, predictions: mockEarningsPredictionsChartData },
    selectedTimeframe: '1M' as const,
    setSelectedTimeframe: () => {},
    availableTimeframes: MY_EARNINGS_TIMEFRAMES,
  }),
]
