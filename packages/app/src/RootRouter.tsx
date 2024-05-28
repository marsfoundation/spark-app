import { createBrowserRouter } from 'react-router-dom'

import { paths } from './config/paths'
import { NotFound } from './features/errors/NotFound'
import { EasyBorrowPage } from './pages/Borrow'
import { DashboardPage } from './pages/Dashboard'
import { MarketDetails } from './pages/MarketDetails'
import { Markets } from './pages/Markets'
import { RootRoute } from './pages/Root'
import { Savings } from './pages/Savings'

export const rootRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
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
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
])
