import { getChainConfigEntry } from '@/config/chain'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { LifiQueryMetaEvaluator } from '.'
import { MockLifiQueryMetaEvaluator } from './MockLifiQueryMetaEvaluator'
import { RealLifiQueryMetaEvaluator } from './RealLifiQueryMetaEvaluator'

export function useLifiQueryMetaEvaluator(): LifiQueryMetaEvaluator {
  // avoid calling useMarketInfo in storybook
  if (import.meta.env.STORYBOOK_PREVIEW) {
    return new MockLifiQueryMetaEvaluator()
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { marketInfo } = useMarketInfo()

  const waivedTokens = (() => {
    if (!getChainConfigEntry(marketInfo.chainId).supportsLifiWaivedFees) {
      return {}
    }
    const dai = marketInfo.DAI.address
    const sdai = marketInfo.sDAI.address
    const usdc = marketInfo.findTokenBySymbol(TokenSymbol('USDC'))?.address

    return { dai, sdai, usdc }
  })()

  return new RealLifiQueryMetaEvaluator(waivedTokens)
}
