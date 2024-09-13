export const paths = {
  easyBorrow: '/',
  myPortfolio: '/my-portfolio',
  markets: '/markets',
  savings: '/savings',
  farms: '/farms',
  marketDetails: '/market-details/:chainId/:asset',
  farmDetails: '/farm-details/:chainId/:address',
} as const

export interface PathAliases {
  path: typeof paths[keyof typeof paths]
  aliases: string[]
}

export const pathsAliases: PathAliases[] = [
  {
    path: paths.myPortfolio,
    aliases: ['/dashboard'],
  },
]
