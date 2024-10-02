import { MyEarningsChart } from '@/features/savings/components/savings-chart/components/MyEarningsChart'
import { DsrChart } from '@/features/savings/components/savings-chart/components/savings-rate-chart/DsrChart'
import { SsrChart } from '@/features/savings/components/savings-chart/components/savings-rate-chart/SsrChart'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '@/features/savings/components/savings-chart/fixtures/mockEarningsChartData'
import {
  mockDsrChartData,
  mockSsrChartData,
} from '@/features/savings/components/savings-chart/fixtures/mockSavingsRateChartData'
import { ChartTab } from '../components/ChartTabsPanel'

export const mockChartsPanelMultipleTabs: ChartTab[] = [
  {
    id: 'earnings',
    label: 'My Earnings',
    component: ({ height }) => (
      <MyEarningsChart data={mockEarningsChartData} predictions={mockEarningsPredictionsChartData} height={height} />
    ),
  },
  {
    id: 'dsr',
    label: 'DSR',
    component: ({ height }) => <DsrChart data={mockDsrChartData} height={height} />,
  },
  {
    id: 'ssr',
    label: 'SSR',
    component: ({ height }) => <SsrChart data={mockSsrChartData} height={height} />,
  },
]

export const mockChartsPanelSingleTab: ChartTab[] = [
  {
    id: 'earnings',
    label: 'My Earnings',
    component: ({ height }) => (
      <MyEarningsChart data={mockEarningsChartData} predictions={mockEarningsPredictionsChartData} height={height} />
    ),
  },
]
