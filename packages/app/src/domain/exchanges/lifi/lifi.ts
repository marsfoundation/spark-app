import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber, Percentage } from '../../types/NumericValues'
import { LifiQuoteMeta } from './meta'
import { preprocessSearchParams } from './preprocessSearchParams'
import { QuoteResponse, ReverseQuoteResponse } from './types'
import { quoteResponseSchema, reverseQuoteResponseSchema } from './validation'

export interface GetQuoteOptions {
  fromToken: CheckedAddress
  toToken: CheckedAddress
  amount: BaseUnitNumber
  meta: LifiQuoteMeta
  maxSlippage: Percentage
  maxPriceImpact?: Percentage
  allowExchanges?: string[]
  chainId: number
  userAddress: CheckedAddress
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
  maxPriceImpact?: string
  allowExchanges?: string[]
}

interface ReverseQuoteRequestParams {
  fromChain: string
  toChain: string
  fromAddress: CheckedAddress
  fromToken: CheckedAddress
  toToken: CheckedAddress
  toAmount: string
  integrator: string
  fee: string
  slippage: string
  maxPriceImpact?: string
  allowExchanges?: string[]
  contractCalls: []
}

export class LiFi {
  private readonly baseUrl = 'https://li.quest'
  private readonly pathName = 'v1/quote/contractCalls'

  async getReverseQuote(getQuoteOptions: GetQuoteOptions): Promise<ReverseQuoteResponse> {
    const url = this.buildReverseQuoteUrl()
    const options = this.buildReverseQuoteRequestOptions(getQuoteOptions)

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Failed to get LiFi reverse quote: ${response.statusText}`)
    }
    const result = await response.json()

    return this.parseReverseQuoteResponse(result)
  }

  async getQuote(getQuoteOptions: GetQuoteOptions): Promise<QuoteResponse> {
    const url = this.buildQuoteUrl(getQuoteOptions)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error fetching exchange quote')
    }
    const result = await response.json()

    return this.parseQuoteResponse(result)
  }

  getKey(chainId: number, userAddress: CheckedAddress): string {
    return `lifi-${chainId}-${userAddress}`
  }

  private parseReverseQuoteResponse(response: unknown): ReverseQuoteResponse {
    return reverseQuoteResponseSchema.parse(response)
  }

  private parseQuoteResponse(response: unknown): QuoteResponse {
    return quoteResponseSchema.parse(response)
  }

  private buildQuoteUrl({
    fromToken,
    toToken,
    amount,
    meta,
    maxSlippage,
    allowExchanges,
    maxPriceImpact,
    chainId,
    userAddress,
  }: GetQuoteOptions): URL {
    const url = new URL(this.baseUrl)
    url.pathname = '/v1/quote'
    const params = {
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromToken,
      fromAmount: amount.toFixed(),
      toToken,
      integrator: meta.integratorKey,
      fee: meta.fee.toFixed(),
      slippage: maxSlippage.toFixed(),
      ...(maxPriceImpact ? { maxPriceImpact: maxPriceImpact.toFixed() } : {}),
      ...(allowExchanges ? { allowExchanges } : {}),
    } satisfies QuoteRequestParams

    url.search = new URLSearchParams(preprocessSearchParams(params)).toString()
    return url
  }

  private buildReverseQuoteUrl(): URL {
    const url = new URL(this.baseUrl)
    url.pathname = this.pathName
    return url
  }

  private buildReverseQuoteRequestOptions({
    fromToken,
    toToken,
    amount,
    meta,
    maxSlippage,
    maxPriceImpact,
    allowExchanges,
    chainId,
    userAddress
  }: GetQuoteOptions): RequestInit {
    const params = {
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromToken,
      toToken,
      toAmount: amount.toFixed(),
      integrator: meta.integratorKey,
      fee: meta.fee.toFixed(),
      slippage: maxSlippage.toFixed(),
      ...(maxPriceImpact ? { maxPriceImpact: maxPriceImpact.toFixed() } : {}),
      ...(allowExchanges ? { allowExchanges } : {}),
      contractCalls: [],
    } satisfies ReverseQuoteRequestParams
    return {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify(params),
    }
  }
}
