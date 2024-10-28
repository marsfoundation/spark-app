import { RouteObject, createBrowserRouter, redirect } from 'react-router-dom'

import { Path, paths } from './config/paths'
import { RouterErrorFallback } from './features/errors'
import { NotFound } from './features/errors/NotFound'
import { EasyBorrowPage } from './pages/Borrow'
import { MarketDetails } from './pages/MarketDetails'
import { Markets } from './pages/Markets'
import { MyPortfolioPage } from './pages/MyPortfolio'
import { RootRoute } from './pages/Root'

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
            element: <MyPortfolioPage />,
          },
          // {
          //   path: paths.savings,
          //   element: <Savings />,
          // },
          {
            path: paths.markets,
            element: <Markets />,
          },
          {
            path: paths.marketDetails,
            element: <MarketDetails />,
          },
          // {
          //   path: paths.farms,
          //   element: <Farms />,
          // },
          // {
          //   path: paths.farmDetails,
          //   element: <FarmDetails />,
          // },
          ...createAliasRoutes([
            {
              path: paths.marketDetails,
              aliases: ['/market-details/:chainId/:asset'],
            },
            // {
            //   path: paths.farmDetails,
            //   aliases: ['/farm-details/:chainId/:address'],
            // },
            {
              path: paths.myPortfolio,
              aliases: ['/dashboard'],
            },
            // {
            //   path: paths.savings,
            //   aliases: ['/savings'],
            // },
          ]),
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
])

interface PathAliases {
  path: (typeof paths)[Path]
  aliases: string[]
}

function createAliasRoutes(paths: PathAliases[]): RouteObject[] {
  return paths.flatMap(({ aliases, path }) => {
    return aliases.map((alias) => ({
      path: alias,
      loader: ({ params }) => {
        const { chainId, address, asset } = params
        const redirectPath = path
          .replace(':chainId', chainId ?? '')
          .replace(':address', address ?? '')
          .replace(':asset', asset ?? '')
        return redirect(redirectPath)
      },
    }))
  })
}
