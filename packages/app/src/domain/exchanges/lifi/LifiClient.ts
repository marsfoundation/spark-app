import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber, Percentage } from '../../types/NumericValues'
import { preprocessSearchParams } from './preprocessSearchParams'
import { QuoteResponse, ReverseQuoteResponse } from './types'
import { quoteResponseSchema, reverseQuoteResponseSchema } from './validation'

export interface GetQuoteOptions {
  chainId: number
  userAddress: CheckedAddress
  fromToken: CheckedAddress
  toToken: CheckedAddress
  amount: BaseUnitNumber
  integratorKey: string
  fee: Percentage
  maxSlippage: Percentage
  maxPriceImpact?: Percentage
  allowExchanges?: string[]
}

export interface LifiQuoteRequestParams {
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

export interface LifiReverseQuoteRequestParams {
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

export class LiFiClient {
  private readonly baseUrl = 'https://li.quest'
  private readonly reverseQuotePath = 'v1/quote/contractCalls'
  private readonly quotePath = 'v1/quote'

  async getQuote(getQuoteOptions: GetQuoteOptions): Promise<QuoteResponse> {
    const url = this.buildQuoteUrl(getQuoteOptions)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error fetching exchange quote')
    }
    const result = await response.json()

    return quoteResponseSchema.parse(result)
  }

  async getReverseQuote(getQuoteOptions: GetQuoteOptions): Promise<ReverseQuoteResponse> {
    const url = this.buildReverseQuoteUrl()
    const options = this.buildReverseQuoteRequestOptions(getQuoteOptions)

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Failed to get LiFi reverse quote: ${response.statusText}`)
    }
    const result = await response.json()

    return reverseQuoteResponseSchema.parse(result)
  }

  private buildQuoteUrl({
    fromToken,
    toToken,
    amount,
    fee,
    integratorKey,
    maxSlippage,
    allowExchanges,
    maxPriceImpact,
    chainId,
    userAddress,
  }: GetQuoteOptions): URL {
    const url = new URL(this.baseUrl)
    url.pathname = this.quotePath
    const params = {
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromToken,
      fromAmount: amount.toFixed(),
      toToken,
      integrator: integratorKey,
      fee: fee.toFixed(),
      slippage: maxSlippage.toFixed(),
      ...(maxPriceImpact ? { maxPriceImpact: maxPriceImpact.toFixed() } : {}),
      ...(allowExchanges ? { allowExchanges } : {}),
    } satisfies LifiQuoteRequestParams

    url.search = new URLSearchParams(preprocessSearchParams(params)).toString()
    return url
  }

  private buildReverseQuoteUrl(): URL {
    const url = new URL(this.baseUrl)
    url.pathname = this.reverseQuotePath
    return url
  }

  private buildReverseQuoteRequestOptions({
    fromToken,
    toToken,
    amount,
    fee,
    integratorKey,
    maxSlippage,
    maxPriceImpact,
    allowExchanges,
    chainId,
    userAddress,
  }: GetQuoteOptions): RequestInit {
    const params = {
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromToken,
      toToken,
      toAmount: amount.toFixed(),
      integrator: integratorKey,
      fee: fee.toFixed(),
      slippage: maxSlippage.toFixed(),
      ...(maxPriceImpact ? { maxPriceImpact: maxPriceImpact.toFixed() } : {}),
      ...(allowExchanges ? { allowExchanges } : {}),
      contractCalls: [],
    } satisfies LifiReverseQuoteRequestParams
    return {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify(params),
    }
  }
}
