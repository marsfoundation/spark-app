import { Token } from '@/domain/types/Token'
import { AccountType } from '../../types'

export function savingsTokenToAccountType(token: Token): AccountType {
  switch (token.symbol) {
    case 'sUSDS':
      return 'susds'
    case 'sUSDC':
      return 'susdc'
    case 'sDAI':
      return 'sdai'
    default:
      return 'susds'
  }
}
