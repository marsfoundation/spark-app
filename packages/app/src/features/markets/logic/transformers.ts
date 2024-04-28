import { generatePath } from 'react-router-dom'
import { mainnet } from 'viem/chains'

import { getChainConfigEntry } from '@/config/chain'
import { getAirdropsData } from '@/config/chain/utils/airdrops'
import { paths } from '@/config/paths'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { RowClickOptions } from '@/ui/molecules/data-table/DataTable'
import { applyTransformers, Transformer, TransformerResult } from '@/utils/applyTransformers'

import { MarketEntry } from '../types'

export interface MarketEntryRowData extends MarketEntry {
  rowClickOptions: RowClickOptions
}

type MarketEntryTransformer = Transformer<[number, Reserve, Reserve[]], TransformerResult<MarketEntryRowData>>

function getTransformers(): MarketEntryTransformer[] {
  return [skipInactiveReserves, mergeDaiMarkets, renameReserve, makeMarketEntry]
}

export function transformReserves(marketInfo: MarketInfo): MarketEntry[] {
  const transformers = getTransformers()
  return marketInfo.reserves
    .map((r) => {
      return applyTransformers(marketInfo.chainId, r, marketInfo.reserves)(transformers)
    })
    .filter((r): r is MarketEntryRowData => r !== null)
}

function skipInactiveReserves(_: number, reserve: Reserve): undefined | null {
  if (reserve.status === 'not-active') return null

  return undefined
}

function renameReserve(chainId: number, reserve: Reserve): MarketEntryRowData | undefined {
  const { tokenSymbolToReplacedName } = getChainConfigEntry(chainId)
  if (Object.keys(tokenSymbolToReplacedName).includes(reserve.token.symbol)) {
    return makeMarketEntry(chainId, {
      ...reserve,
      token: reserve.token.clone({
        symbol: tokenSymbolToReplacedName[reserve.token.symbol]!.symbol,
        name: tokenSymbolToReplacedName[reserve.token.symbol]!.name,
      }),
    })
  }
}

function mergeDaiMarkets(
  chainId: number,
  reserve: Reserve,
  allReserves: Reserve[],
): MarketEntryRowData | undefined | null {
  const sDAIMarket = allReserves.find((r) => r.token.symbol === 'sDAI')
  const { tokenSymbolToReplacedName, id: originChainId } = getChainConfigEntry(chainId)
  // @note: this can happen on some domains when DAI rollout is not yet complete
  // Maker info is only available on mainnet now, so we don't merge DAI markets on other chains
  if (!sDAIMarket || originChainId !== mainnet.id) return

  if (reserve.token.symbol === 'DAI') {
    return makeMarketEntry(chainId, {
      ...reserve,
      token: reserve.token.clone({
        symbol: tokenSymbolToReplacedName[reserve.token.symbol]!.symbol,
        name: tokenSymbolToReplacedName[reserve.token.symbol]!.name,
      }),
      ...(import.meta.env.VITE_FEATURE_DISABLE_DAI_LEND === '1' && {
        supplyAvailabilityStatus: 'no',
        supplyAPY: Percentage(0),
      }),
      collateralEligibilityStatus: sDAIMarket.collateralEligibilityStatus,
    })
  }

  if (reserve.token.symbol === 'sDAI') {
    return null
  }
}

export function makeMarketEntry(chainId: number, reserve: Reserve): MarketEntryRowData {
  const airdrops = getAirdropsData(chainId, reserve.token.symbol)
  return {
    token: reserve.token,
    reserveStatus: reserve.status,
    totalSupplied: reserve.totalLiquidity,
    depositAPYDetails: {
      apy: reserve.supplyAPY,
      incentives: reserve.incentives.deposit,
      airdrops: airdrops.deposit,
    },
    totalBorrowed: reserve.totalDebt,
    borrowAPYDetails: {
      apy: reserve.variableBorrowApy,
      incentives: reserve.incentives.borrow,
      airdrops: airdrops.borrow,
    },
    marketStatus: {
      supplyAvailabilityStatus: reserve.supplyAvailabilityStatus,
      collateralEligibilityStatus: reserve.collateralEligibilityStatus,
      borrowEligibilityStatus: reserve.borrowEligibilityStatus,
    },
    rowClickOptions: {
      destination: generatePath(paths.marketDetails, { asset: reserve.token.address, chainId: chainId.toString() }),
    },
  }
}
