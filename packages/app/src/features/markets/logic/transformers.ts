import { getChainConfigEntry } from '@/config/chain'
import { getAirdropsData } from '@/config/chain/utils/airdrops'
import { paths } from '@/config/paths'
import { sortByUsdValue } from '@/domain/common/sorters'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { RowClickOptions } from '@/ui/molecules/data-table/DataTable'
import { Transformer, TransformerResult, applyTransformers } from '@/utils/applyTransformers'
import { raise } from '@marsfoundation/common-universal'
import { generatePath } from 'react-router-dom'
import { MarketEntry } from '../types'

export interface MarketEntryRowData extends MarketEntry {
  rowClickOptions: RowClickOptions
}

type MarketEntryTransformer = Transformer<[number, Reserve, Reserve[]], TransformerResult<MarketEntryRowData>>

function getTransformers(): MarketEntryTransformer[] {
  return [skipInactiveReserves, renameReserve, makeMarketEntry]
}

export function transformReserves(marketInfo: MarketInfo): MarketEntry[] {
  const transformers = getTransformers()
  return marketInfo.reserves
    .map((r) => {
      return applyTransformers(marketInfo.chainId, r, marketInfo.reserves)(transformers)
    })
    .filter((r): r is MarketEntryRowData => r !== null)
    .sort((a, b) => -sortByUsdValue(a, b, 'totalSupplied')) // this is needed for mobile view where we don't have sorting functions
}

function skipInactiveReserves(_: number, reserve: Reserve): undefined | null {
  if (reserve.status === 'not-active') return null

  return undefined
}

function renameReserve(chainId: number, reserve: Reserve): MarketEntryRowData | undefined {
  const { tokenSymbolToReplacedName } =
    getChainConfigEntry(chainId).markets ?? raise('Markets config is not defined on this chain')
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
