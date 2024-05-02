import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber, Percentage } from '../../types/NumericValues'
import { LifiQuoteMeta } from './meta'
import { preprocessSearchParams } from './preprocessSearchParams'
import { QuoteResponse, ReverseQuoteResponse } from './types'
import { quoteResponseSchema, reverseQuoteResponseSchema } from './validation'

export interface LiFiConfig {
  chainId: number
  userAddress: CheckedAddress
}

export interface GetQuoteOptions {
  fromToken: CheckedAddress
  toToken: CheckedAddress
  amount: BaseUnitNumber
  meta: LifiQuoteMeta
  maxSlippage: Percentage
  allowExchanges?: string[]
}

interface QuoteRequestParams {
  fromChain: string
  toChain: string
  fromAddress: CheckedAddress
  fromToken: CheckedAddress
  fromAmount: string
  toToken: CheckedAddress
  integrator: string
  fee: string
  slippage: string
  allowExchanges?: string[]
}

interface ReverseQuoteRequestParams {
  fromChain: string
  toChain: string
  fromAddress: CheckedAddress
  fromToken: CheckedAddress
  toToken: CheckedAddress
  toAmount: string
  slippage: string
  allowExchanges?: string[]
  contractCalls: []
}

export class LiFi {
  private baseUrl = 'https://li.quest'
  private chainId: number
  private userAddress: CheckedAddress

  constructor(config: LiFiConfig) {
    this.chainId = config.chainId
    this.userAddress = config.userAddress
  }

  getKey(): string {
    return `lifi-${this.chainId}-${this.userAddress}`
  }

  private parseQuoteResponse(response: unknown): QuoteResponse {
    return quoteResponseSchema.parse(response)
  }

  private buildQuoteUrl({ fromToken, toToken, amount, meta, maxSlippage, allowExchanges }: GetQuoteOptions): URL {
    const url = new URL(this.baseUrl)
    url.pathname = '/v1/quote'
    const params = {
      fromChain: this.chainId.toString(),
      toChain: this.chainId.toString(),
      fromAddress: this.userAddress,
      fromToken,
      fromAmount: amount.toFixed(),
      toToken,
      integrator: meta.integratorKey,
      fee: meta.fee.toFixed(),
      slippage: maxSlippage.toFixed(),
      ...(allowExchanges ? { allowExchanges } : {}),
    } satisfies QuoteRequestParams

    url.search = new URLSearchParams(preprocessSearchParams(params)).toString()
    return url
  }

  async getQuote({
    fromToken,
    toToken,
    amount,
    maxSlippage,
    allowExchanges,
    meta,
  }: GetQuoteOptions): Promise<QuoteResponse> {
    const url = this.buildQuoteUrl({ fromToken, toToken, amount, meta, maxSlippage, allowExchanges })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error fetching exchange quote')
    }
    const result = await response.json()

    return this.parseQuoteResponse(result)
  }

  private parseReverseQuoteResponse(response: unknown): ReverseQuoteResponse {
    return reverseQuoteResponseSchema.parse(response)
  }

  private buildReverseQuoteUrl(): URL {
    const url = new URL(this.baseUrl)
    url.pathname = 'v1/quote/contractCalls'
    return url
  }

  private buildReverseQuoteRequestOptions({
    fromToken,
    toToken,
    amount,
    maxSlippage,
    allowExchanges,
  }: GetQuoteOptions): RequestInit {
    const params = {
      fromChain: this.chainId.toString(),
      toChain: this.chainId.toString(),
      fromAddress: this.userAddress,
      fromToken,
      toToken,
      toAmount: amount.toFixed(),
      slippage: maxSlippage.toFixed(),
      ...(allowExchanges ? { allowExchanges } : {}),
      contractCalls: [],
    } satisfies ReverseQuoteRequestParams
    return {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify(params),
    }
  }

  async getReverseQuote({
    fromToken,
    toToken,
    amount,
    meta,
    maxSlippage,
    allowExchanges,
  }: GetQuoteOptions): Promise<ReverseQuoteResponse> {
    const url = this.buildReverseQuoteUrl()
    const options = this.buildReverseQuoteRequestOptions({
      fromToken,
      toToken,
      amount,
      meta,
      maxSlippage,
      allowExchanges,
    })

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Failed to get LiFi reverse quote: ${response.statusText}`)
    }
    const result = await response.json()

    return this.parseReverseQuoteResponse(result)
  }
}
