import { assert } from '@/utils/assert'
import BigNumber from 'bignumber.js'
import { zeroAddress } from 'viem'

import { findSignificantPrecision } from '../common/format'
import { CheckedAddress } from './CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber } from './NumericValues'
import { TokenSymbol } from './TokenSymbol'

export interface TokenConstructorParams {
  symbol: TokenSymbol
  name: string
  decimals: number
  address: CheckedAddress
  unitPriceUsd: string
  isAToken?: boolean
}

export type TokenCloneParams = Partial<Omit<TokenConstructorParams, 'unitPriceUsd'>> & {
  unitPriceUsd?: NormalizedUnitNumber
}

export class Token {
  readonly symbol: TokenSymbol
  readonly name: string
  readonly decimals: number
  readonly address: CheckedAddress
  readonly unitPriceUsd: NormalizedUnitNumber
  readonly isAToken: boolean

  constructor({ symbol, name, decimals, address, unitPriceUsd, isAToken = false }: TokenConstructorParams) {
    // sanity checks
    assert(decimals >= 2, 'decimals value should be greater than 2')
    assert(decimals <= 30, 'decimals value should be less than 30')

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.address = address
    this.unitPriceUsd = NormalizedUnitNumber(unitPriceUsd)
    this.isAToken = isAToken
  }

  public formatUSD(
    value: NormalizedUnitNumber,
    { compact = false, showCents = 'always', tokenUnitPriceOverride }: FormatUSDOptions = {},
  ): string {
    const USDValue = this.toUSD(value, tokenUnitPriceOverride)
    if (value.gt(0) && USDValue.lt(0.01)) {
      return '<$0.01'
    }

    if (compact && USDValue.gte(1000)) {
      return `$${formatCompact(USDValue)}`
    }

    const fractionDigitsConfig = {
      always: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      never: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      'when-not-round': { minimumFractionDigits: value.isInteger() ? 0 : 2, maximumFractionDigits: 2 },
    } satisfies Record<string, { minimumFractionDigits: number; maximumFractionDigits: number }>

    const usdFormatter = getNumberFormatter({
      style: 'currency',
      currency: 'USD',
      ...fractionDigitsConfig[showCents],
    })
    return usdFormatter.format(USDValue.toNumber())
  }

  public format(value: NormalizedUnitNumber, options: FormatOptions): string {
    if (options.style === 'auto') {
      return formatAuto({ value, unitPriceUsd: this.unitPriceUsd, options })
    }
    return formatCompact(value)
  }

  public toBaseUnit(value: NormalizedUnitNumber): BaseUnitNumber {
    const normalizedValue = NormalizedUnitNumber(value.decimalPlaces(this.decimals, BigNumber.ROUND_DOWN))
    return BaseUnitNumber(normalizedValue.shiftedBy(this.decimals))
  }

  public fromBaseUnit(value: BaseUnitNumber): NormalizedUnitNumber {
    return NormalizedUnitNumber(value.shiftedBy(-this.decimals))
  }

  public toUSD(value: NormalizedUnitNumber, tokenUnitPriceOverride?: NormalizedUnitNumber): NormalizedUnitNumber {
    return NormalizedUnitNumber(value.multipliedBy(tokenUnitPriceOverride ?? this.unitPriceUsd))
  }

  public clone({ address, symbol, name, isAToken, decimals, unitPriceUsd }: TokenCloneParams): Token {
    return new Token({
      address: address ?? this.address,
      symbol: symbol ?? this.symbol,
      name: name ?? this.name,
      isAToken: isAToken ?? this.isAToken,
      decimals: decimals ?? this.decimals,
      unitPriceUsd: (unitPriceUsd ?? this.unitPriceUsd).toFixed(),
    })
  }

  public createAToken(address: CheckedAddress): Token {
    return this.clone({
      address,
      symbol: TokenSymbol(`a${this.symbol}`),
      isAToken: true,
    })
  }
}

export interface FormatUSDOptions {
  compact?: boolean
  showCents?: 'always' | 'when-not-round' | 'never'
  tokenUnitPriceOverride?: NormalizedUnitNumber
}

export interface FormatOptions {
  style?: 'auto' | 'compact'
  tokenUnitPriceOverride?: NormalizedUnitNumber
}

export const USD_MOCK_TOKEN = new Token({
  address: CheckedAddress(zeroAddress),
  symbol: TokenSymbol('USD'),
  name: 'US Dollar',
  decimals: 2,
  unitPriceUsd: '1',
})

export const SPK_MOCK_TOKEN = new Token({
  address: CheckedAddress(zeroAddress),
  symbol: TokenSymbol('SPK'),
  name: 'Spark Token',
  decimals: 18,
  unitPriceUsd: '10',
})

interface FormatAutoParams {
  value: NormalizedUnitNumber
  unitPriceUsd?: NormalizedUnitNumber
  options?: Omit<FormatOptions, 'style'>
}

const FALLBACK_PRECISION = 4

function formatAuto({ value, unitPriceUsd, options }: FormatAutoParams): string {
  let precision: number

  if (!unitPriceUsd) {
    precision = options?.tokenUnitPriceOverride
      ? findSignificantPrecision(options.tokenUnitPriceOverride)
      : FALLBACK_PRECISION
  } else {
    precision = findSignificantPrecision(unitPriceUsd)
  }

  const leastSignificantValue = BigNumber(1).shiftedBy(-precision)
  const rounded = BigNumber(value.toFixed(precision))
  if (value.gt(0) && rounded.lt(leastSignificantValue)) {
    return `<${leastSignificantValue.toFixed()}`
  }

  const formatter = getNumberFormatter({
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.max(precision, 2),
  })

  return formatter.format(value.toNumber())
}

function formatCompact(value: NormalizedUnitNumber): string {
  const n = value.toNumber()
  if (n === 0) return '0'
  if (n < 0.001) return '<0.001'

  const formatterOptions = getFormatterOptions(n)
  return getNumberFormatter(formatterOptions).format(n)
}

function countSignificantDigits(n: number): number {
  const totalDigits = Math.floor(Math.log10(Math.abs(n))) + 1
  const significantDigits = totalDigits % 3 || 3
  return significantDigits
}

function getNumberFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  return new Intl.NumberFormat('en-US', options)
}

function getFormatterOptions(n: number): Intl.NumberFormatOptions {
  if (n < 1) {
    return { maximumFractionDigits: 3 }
  }
  if (n >= 1000 && n < 10_000) {
    return {
      maximumFractionDigits: 0,
    }
  }
  return {
    notation: 'compact',
    maximumFractionDigits: Math.max(0, 4 - countSignificantDigits(n)),
  }
}

type TokenWithoutPriceParams = Omit<TokenConstructorParams, 'unitPriceUsd'>

export class TokenWithoutPrice extends Token {
  constructor(params: TokenWithoutPriceParams) {
    super({ ...params, unitPriceUsd: '0' })
  }

  public toUSD(value: NormalizedUnitNumber, tokenUnitPriceOverride: NormalizedUnitNumber): NormalizedUnitNumber {
    return super.toUSD(value, tokenUnitPriceOverride)
  }

  public formatUSD(
    value: NormalizedUnitNumber,
    options: Omit<FormatUSDOptions, 'tokenUnitPriceOverride'> & {
      tokenUnitPriceOverride: NormalizedUnitNumber
    },
  ): string {
    return super.formatUSD(value, options)
  }

  public format(
    value: NormalizedUnitNumber,
    options: Omit<FormatOptions, 'tokenUnitPriceOverride'> & {
      tokenUnitPriceOverride: NormalizedUnitNumber | undefined
    },
  ): string {
    return super.format(value, options)
  }

  public clone(_: TokenCloneParams): Token {
    throw new Error(`clone method is not allowed for ${this.name}`)
  }

  public createAToken(_: CheckedAddress): Token {
    throw new Error(`createAToken method is not allowed for ${this.name}`)
  }

  public static from(token: Token): TokenWithoutPrice {
    return new TokenWithoutPrice({
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      address: token.address,
      isAToken: token.isAToken,
    })
  }
}
