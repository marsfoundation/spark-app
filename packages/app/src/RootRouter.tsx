import { RouteObject, createBrowserRouter, redirect } from 'react-router-dom'

import { PathAliases, paths, pathsAliases } from './config/paths'
import { RouterErrorFallback } from './features/errors'
import { NotFound } from './features/errors/NotFound'
import { EasyBorrowPage } from './pages/Borrow'
import { DashboardPage } from './pages/MyPortfolio'
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
            path: paths.myPortfolio,
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
          ...createAliasRoutes(pathsAliases),
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
])

function createAliasRoutes(paths: PathAliases[]) {
  return paths.reduce((aliasRoutes, { aliases, path }) => {
    const pathAliasRoutes: RouteObject[] = aliases.map((alias) => ({
      path: alias,
      loader: () => redirect(path),
    }))

    aliasRoutes.push(...pathAliasRoutes)

    return aliasRoutes
  }, [] as RouteObject[])
}
