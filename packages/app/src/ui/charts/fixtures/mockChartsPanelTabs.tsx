import { MyEarningsChart } from '@/features/savings/components/savings-chart/components/MyEarningsChart'
import { DsrChart } from '@/features/savings/components/savings-chart/components/savings-rate-chart/DsrChart'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '@/features/savings/components/savings-chart/fixtures/mockEarningsChartData'
import {
  mockDsrChartData,
  mockSsrChartData,
} from '@/features/savings/components/savings-chart/fixtures/mockSavingsRateChartData'
import { createChartTab } from '../components/ChartTabsPanel'

export const mockChartsPanelMultipleTabs = [
  createChartTab({
    id: 'earnings',
    label: 'My Earnings',
    component: MyEarningsChart,
    isError: false,
    isPending: false,
    props: { data: mockEarningsChartData, predictions: mockEarningsPredictionsChartData },
  }),
  createChartTab({
    id: 'dsr',
    label: 'DSR',
    component: DsrChart,
    isError: false,
    isPending: false,
    props: { data: mockDsrChartData },
  }),
  createChartTab({
    id: 'ssr',
    label: 'SSR',
    component: DsrChart,
    isError: false,
    isPending: false,
    props: { data: mockSsrChartData },
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
  }),
]
