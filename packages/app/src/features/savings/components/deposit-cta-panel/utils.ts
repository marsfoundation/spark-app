import { TokenSymbol } from '@/domain/types/TokenSymbol'

export type Variant = 'susds' | 'susdc' | 'sdai'

export function symbolToVariant(symbol: TokenSymbol, fallback: Variant = 'susds'): Variant {
  switch (symbol.toLocaleLowerCase()) {
    case 'susds':
      return 'susds'
    case 'susdc':
      return 'susdc'
    case 'sdai':
      return 'sdai'
    default:
      return fallback
  }
}
