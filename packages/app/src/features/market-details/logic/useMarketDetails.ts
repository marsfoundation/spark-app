import { getChainConfigEntry } from '@/config/chain'
import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { useCapAutomatorInfo } from '@/domain/cap-automator/useCapAutomatorInfo'
import { useD3MInfo } from '@/domain/d3m-info/useD3MInfo'
import { NotFoundError } from '@/domain/errors/not-found'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useMarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { raise } from '@/utils/assert'
import { Address } from 'viem'
import { useChainId } from 'wagmi'

import { UseOracleInfoResult, useOracleInfo } from '@/domain/oracles/useOracleInfo'
import { MarketOverview, WalletOverview } from '../types'
import { makeDaiMarketOverview } from './makeDaiMarketOverview'
import { makeMarketOverview } from './makeMarketOverview'
import { makeWalletOverview } from './makeWalletOverview'
import { useMarketDetailsParams } from './useMarketDetailsParams'

export interface UseMarketDetailsResult {
  token: Token
  aToken: Token
  variableDebtTokenAddress: Address
  chainName: string
  chainId: number
  marketOverview: MarketOverview
  walletOverview: WalletOverview
  chainMismatch: boolean
  oracleInfo: UseOracleInfoResult
}

export function useMarketDetails(): UseMarketDetailsResult {
  const { asset, chainId } = useMarketDetailsParams()
  const { marketInfo } = useMarketInfo({ chainId })
  const { D3MInfo } = useD3MInfo({ chainId })
  const walletInfo = useMarketWalletInfo()
  const { meta: chainMeta } = getChainConfigEntry(chainId)
  const connectedChainId = useChainId()

  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const chainMismatch = connectedChainId !== chainId

  const reserve = marketInfo.findReserveByUnderlyingAsset(asset) ?? raise(new NotFoundError())

  const isDaiOverview = reserve.token.symbol === marketInfo.DAI.symbol && D3MInfo

  const { capAutomatorInfo } = useCapAutomatorInfo({
    chainId,
    token: isDaiOverview ? marketInfo.sDAI : reserve.token,
  })

  const oracleInfo = useOracleInfo({
    reserve,
    marketInfo,
  })

  const marketOverview = isDaiOverview
    ? makeDaiMarketOverview({
        reserve,
        marketInfo,
        D3MInfo,
        sDaiCapAutomatorInfo: capAutomatorInfo,
      })
    : makeMarketOverview({
        reserve,
        marketInfo,
        capAutomatorInfo,
      })

  const walletOverview = makeWalletOverview({
    reserve,
    marketInfo,
    walletInfo,
    connectedChainId,
    nativeAssetInfo,
  })

  return {
    token: reserve.token,
    aToken: reserve.aToken,
    variableDebtTokenAddress: reserve.variableDebtTokenAddress,
    chainName: chainMeta.name,
    chainId,
    marketOverview,
    walletOverview,
    chainMismatch,
    oracleInfo,
  }
}
