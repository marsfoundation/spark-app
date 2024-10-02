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

export const mockChartsPanelMultipleTabs = [
  {
    id: 'earnings',
    label: 'My Earnings',
    chart: <MyEarningsChart data={mockEarningsChartData} predictions={mockEarningsPredictionsChartData} />,
  },
  {
    id: 'ssr',
    label: 'SSR',
    chart: <SsrChart data={mockSsrChartData} />,
  },
  {
    id: 'dsr',
    label: 'DSR',
    chart: <DsrChart data={mockDsrChartData} />,
  },
]

export const mockChartsPanelSingleTab = [
  {
    id: 'earnings',
    label: 'My Earnings',
    chart: <MyEarningsChart data={mockEarningsChartData} predictions={mockEarningsPredictionsChartData} />,
  },
]
