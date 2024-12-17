import { MY_EARNINGS_TIMEFRAMES } from '@/domain/savings-charts/useMyEarningsInfo/common'
import { SAVINGS_RATE_TIMEFRAMES } from '@/domain/savings-charts/useSavingsRateInfo/common'
import { MyEarningsChart } from '@/features/savings/components/savings-charts/components/MyEarningsChart'
import { DsrChart } from '@/features/savings/components/savings-charts/components/savings-rate-chart/DsrChart'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '@/features/savings/components/savings-charts/fixtures/mockEarningsChartData'
import {
  mockDsrChartData,
  mockSsrChartData,
} from '@/features/savings/components/savings-charts/fixtures/mockSavingsRateChartData'
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
    id: 'dsr',
    label: 'DSR',
    component: DsrChart,
    isError: false,
    isPending: false,
    props: { data: mockDsrChartData },
    selectedTimeframe: '1M' as const,
    setSelectedTimeframe: () => {},
    availableTimeframes: SAVINGS_RATE_TIMEFRAMES,
  }),
  createChartTab({
    id: 'ssr',
    label: 'SSR',
    component: DsrChart,
    isError: false,
    isPending: false,
    props: { data: mockSsrChartData },
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
