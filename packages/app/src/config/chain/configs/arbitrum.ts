import { psm3SavingsMyEarningsQueryOptions } from '@/domain/savings-charts/my-earnings-query/psm3-savings'
import { arbitrumSusdsSavingsRateQueryOptions } from '@/domain/savings-charts/savings-rate-query/arbitrum'
import { susdsSsrAuthOracleConverterQueryOptions } from '@/domain/savings-converters/susdsSsrAuthOracleConverter'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { arbitrum } from 'viem/chains'
import { ChainConfigEntry } from '../types'
import { defineToken } from '../utils/defineToken'

const usdc = defineToken({
  address: CheckedAddress('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
  oracleType: 'fixed-usd',
  symbol: TokenSymbol('USDC'),
})

const usds = defineToken({
  address: CheckedAddress('0x6491c05A82219b8D1479057361ff1654749b876b'),
  oracleType: 'fixed-usd',
  symbol: TokenSymbol('USDS'),
})

const susds = defineToken({
  address: CheckedAddress('0xdDb46999F8891663a8F2828d25298f70416d7610'),
  oracleType: 'ssr-auth-oracle',
  symbol: TokenSymbol('sUSDS'),
})

export const arbitrumConfig: ChainConfigEntry = {
  originChainId: arbitrum.id,
  daiSymbol: undefined,
  sdaiSymbol: undefined,
  usdsSymbol: usds.symbol,
  susdsSymbol: susds.symbol,
  meta: {
    name: 'Arbitrum',
    logo: assets.chain.arbitrum,
  },
  tokensWithMalformedApprove: [],
  permitSupport: {},
  airdrop: {},
  markets: undefined,
  farms: undefined,
  savings: {
    accounts: [
      {
        savingsToken: susds.symbol,
        underlyingToken: usds.symbol,
        supportedStablecoins: [usds.symbol, usdc.symbol],
        fetchConverterQuery: susdsSsrAuthOracleConverterQueryOptions,
        savingsRateQueryOptions: arbitrumSusdsSavingsRateQueryOptions,
        myEarningsQueryOptions: psm3SavingsMyEarningsQueryOptions,
      },
    ],
    psmStables: [usds.symbol, usdc.symbol],
  },
  definedTokens: [usdc, usds, susds],
}
