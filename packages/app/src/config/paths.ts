export const paths = {
  easyBorrow: '/',
  myPortfolio: '/my-portfolio',
  markets: '/markets',
  savings: '/savings',
  farms: '/farms',
  marketDetails: '/market-details/:chainId/:asset',
  farmDetails: '/farm-details/:chainId/:address',
} as const

export type Path = keyof typeof paths

export const pathGroups: Record<string, Path[]> = {
  Borrow: ['easyBorrow', 'myPortfolio', 'markets', 'marketDetails'],
  Savings: ['savings'],
  Farms: ['farms', 'farmDetails'],
}
