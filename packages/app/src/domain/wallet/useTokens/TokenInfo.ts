import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { raise } from '@/utils/assert'

export interface FeaturedTokens {
  DAI?: TokenSymbol
  sDAI?: TokenSymbol
  NST?: TokenSymbol
  sNST?: TokenSymbol
}

export class TokensInfo {
  constructor(
    private readonly tokens: TokenWithBalance[],
    private readonly featured: FeaturedTokens,
  ) {}

  all(): TokenWithBalance[] {
    return this.tokens
  }

  filter(predicate: (token: TokenWithBalance) => boolean): TokenWithBalance[] {
    return this.tokens.filter(predicate)
  }

  findTokenBySymbol(symbol: TokenSymbol): Token | undefined {
    return this.tokens.find(({ token }) => token.symbol === symbol)?.token
  }

  findOneTokenBySymbol(symbol: TokenSymbol): Token {
    return this.findTokenBySymbol(symbol) ?? raise(`Token with symbol ${symbol} not found`)
  }

  findBalanceBySymbol(symbol: TokenSymbol): NormalizedUnitNumber | undefined {
    return this.tokens.find(({ token }) => token.symbol === symbol)?.balance
  }

  findOneBalanceBySymbol(symbol: TokenSymbol): NormalizedUnitNumber {
    return this.findBalanceBySymbol(symbol) ?? raise(`Balance for symbol ${symbol} not found`)
  }

  findTokenWithBalanceBySymbol(symbol: TokenSymbol): TokenWithBalance | undefined {
    return this.tokens.find(({ token }) => token.symbol === symbol)
  }

  findOneTokenWithBalanceBySymbol(symbol: TokenSymbol): TokenWithBalance {
    return this.findTokenWithBalanceBySymbol(symbol) ?? raise(`Token with symbol ${symbol} not found`)
  }

  get DAI(): Token | undefined {
    return this.featured.DAI && this.findOneTokenBySymbol(this.featured.DAI)
  }

  get sDAI(): Token | undefined {
    return this.featured.sDAI && this.findOneTokenBySymbol(this.featured.sDAI)
  }

  get NST(): Token | undefined {
    return this.featured.NST && this.findOneTokenBySymbol(this.featured.NST)
  }
  
  get sNST(): Token | undefined {
    return this.featured.sNST && this.findOneTokenBySymbol(this.featured.sNST)
  }
}
