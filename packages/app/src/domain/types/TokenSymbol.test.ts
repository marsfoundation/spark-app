import { TokenSymbol } from './TokenSymbol'

describe(TokenSymbol.name, () => {
  test('works with a correct token symbol', () => {
    expect(TokenSymbol('sDAI')).toEqual('sDAI')
    expect(TokenSymbol('ETH')).toEqual('ETH')
    expect(TokenSymbol('wstETH')).toEqual('wstETH')
    expect(TokenSymbol('aSYMBOL')).toEqual('aSYMBOL')
  })

  test('throws for an empty token symbol', () => {
    expect(() => TokenSymbol('')).toThrow('Token symbol should be between 1 and 7 characters.')
  })

  test('throws for a token symbol longer than 7 characters', () => {
    expect(() => TokenSymbol('DAI-WETH')).toThrow('Token symbol should be between 1 and 7 characters.')
  })
})
