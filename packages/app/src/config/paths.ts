import { ChainConfigEntry } from './chain/types'

export const paths = {
  easyBorrow: '/borrow',
  myPortfolio: '/my-portfolio',
  markets: '/markets',
  savings: '/',
  farms: '/farms',
  marketDetails: '/markets/:chainId/:asset',
  farmDetails: '/farms/:chainId/:address',
} as const

export type Path = keyof typeof paths

export const pathGroups = {
  borrow: ['easyBorrow', 'myPortfolio', 'markets', 'marketDetails'],
  savings: ['savings'],
  farms: ['farms', 'farmDetails'],
} satisfies Record<'borrow' | 'savings' | 'farms', Path[]>

export function getSupportedPages(chainConfigEntry: ChainConfigEntry): Path[] {
  return [
    ...(chainConfigEntry.markets ? pathGroups.borrow : []),
    ...(chainConfigEntry.savings ? pathGroups.savings : []),
    ...(chainConfigEntry.farms ? pathGroups.farms : []),
  ]
}
