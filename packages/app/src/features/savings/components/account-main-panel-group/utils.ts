import { Token } from '@/domain/types/Token'
import { AccountType } from './types'

export function underlyingTokenToAccountType(token: Token): AccountType {
  switch (token.symbol) {
    case 'USDS':
      return 'susds'
    case 'USDC':
      return 'susdc'
    case 'DAI':
      return 'sdai'
    default:
      return 'susds'
  }
}
