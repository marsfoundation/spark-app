import { useChainId } from 'wagmi'

import { getChainConfigEntry } from '@/config/chain'
import { useD3MInfo } from '@/domain/d3m-info/useD3MInfo'
import { NotFoundError } from '@/domain/errors/not-found'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { raise } from '@/utils/raise'

import { MarketOverview, WalletOverview } from '../types'
import { makeDaiMarketOverview } from './makeDaiMarketOverview'
import { makeMarketOverview } from './makeMarketOverview'
import { makeWalletOverview } from './makeWalletOverview'
import { useMarketDetailsParams } from './useMarketDetailsParams'

export interface UseMarketDetailsResult {
  token: Token
  chainName: string
  chainId: number
  marketOverview: MarketOverview
  walletOverview: WalletOverview
  chainMismatch: boolean
}

export function useMarketDetails(): UseMarketDetailsResult {
  const { asset, chainId } = useMarketDetailsParams()
  const { marketInfo } = useMarketInfo({ chainId })
  const { D3MInfo } = useD3MInfo({ chainId })
  const walletInfo = useWalletInfo()
  const { meta: chainMeta } = getChainConfigEntry(chainId)
  const connectedChainId = useChainId()

  const chainMismatch = connectedChainId !== chainId

  const reserve = marketInfo.findReserveByUnderlyingAsset(CheckedAddress(asset)) ?? raise(new NotFoundError())

  const isDaiOverview = reserve.token.symbol === TokenSymbol('DAI') && D3MInfo

  const marketOverview = isDaiOverview
    ? makeDaiMarketOverview({
      reserve,
      marketInfo,
      D3MInfo,
    })
    : makeMarketOverview({
      reserve,
      marketInfo,
    })
  const walletOverview = makeWalletOverview({
    reserve,
    marketInfo,
    walletInfo,
    connectedChainId,
  })

  return {
    token: reserve.token,
    chainName: chainMeta.name,
    chainId,
    marketOverview,
    walletOverview,
    chainMismatch,
  }
}
