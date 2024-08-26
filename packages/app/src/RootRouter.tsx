import { createBrowserRouter } from 'react-router-dom'

import { paths } from './config/paths'
import { RouterErrorFallback } from './features/errors'
import { NotFound } from './features/errors/NotFound'
import { EasyBorrowPage } from './pages/Borrow'
import { DashboardPage } from './pages/Dashboard'
import { FarmDetails } from './pages/FarmDetails'
import { Farms } from './pages/Farms'
import { MarketDetails } from './pages/MarketDetails'
import { Markets } from './pages/Markets'
import { RootRoute } from './pages/Root'
import { Savings } from './pages/Savings'

export const rootRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <RouterErrorFallback fullScreen />,
    children: [
      {
        children: [
          {
            path: paths.easyBorrow,
            element: <EasyBorrowPage />,
          },
          {
            path: paths.dashboard,
            element: <DashboardPage />,
          },
          {
            path: paths.savings,
            element: <Savings />,
          },
          {
            path: paths.markets,
            element: <Markets />,
          },
          {
            path: paths.marketDetails,
            element: <MarketDetails />,
          },
          ...(import.meta.env.VITE_DEV_FARMS === '1'
            ? [
                { path: paths.farms, element: <Farms /> },
                { path: paths.farmDetails, element: <FarmDetails /> },
              ]
            : []),
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
])
