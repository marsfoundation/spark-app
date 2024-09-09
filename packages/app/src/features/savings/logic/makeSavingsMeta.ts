import { getChainConfigEntry } from '@/config/chain'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assert, raise } from '@/utils/assert'

export interface SavingsMetaItem {
  savingsToken: TokenSymbol
  stablecoin: TokenSymbol
  rateAcronym: 'SSR' | 'DSR'
  rateName: 'Sky Savings Rate' | 'DAI Savings Rate'
}

export interface SavingsMeta {
  primary: SavingsMetaItem
  secondary?: SavingsMetaItem
}

export function makeSavingsMeta(chainId: number): SavingsMeta {
  const { daiSymbol, sDaiSymbol, USDSSymbol, sUSDSSymbol, savingsDaiInfoQuery, savingsUsdsInfoQuery } =
    getChainConfigEntry(chainId)

  if (savingsUsdsInfoQuery && savingsDaiInfoQuery) {
    assert(USDSSymbol && sUSDSSymbol, 'usds and susds symbols should be defined when savingsUsdsInfoQuery is defined')
    assert(daiSymbol && sDaiSymbol, 'dai and sdai symbols should be defined when savingsDaiInfoQuery is defined')
    return {
      primary: getSavingsMeta({ stablecoin: USDSSymbol, savingsToken: sUSDSSymbol, type: 'ssr' }),
      secondary: getSavingsMeta({ stablecoin: daiSymbol, savingsToken: sDaiSymbol, type: 'dsr' }),
    }
  }

  if (savingsDaiInfoQuery) {
    assert(daiSymbol && sDaiSymbol, 'dai and sdai symbols should be defined when savingsDaiInfoQuery is defined')
    return {
      primary: getSavingsMeta({ stablecoin: daiSymbol, savingsToken: sDaiSymbol, type: 'dsr' }),
    }
  }

  if (savingsUsdsInfoQuery) {
    assert(USDSSymbol && sUSDSSymbol, 'usds and susds symbols should be defined when savingsUsdsInfoQuery is defined')
    return {
      primary: getSavingsMeta({ stablecoin: USDSSymbol, savingsToken: sUSDSSymbol, type: 'ssr' }),
    }
  }

  raise('Savings meta should be defined')
}

interface GetSavingsMetaParams {
  stablecoin: TokenSymbol
  savingsToken: TokenSymbol
  type: 'ssr' | 'dsr'
}

function getSavingsMeta({ stablecoin, savingsToken, type }: GetSavingsMetaParams): SavingsMetaItem {
  return type === 'ssr'
    ? {
        savingsToken,
        stablecoin,
        rateAcronym: 'SSR',
        rateName: 'Sky Savings Rate',
      }
    : {
        savingsToken,
        stablecoin,
        rateAcronym: 'DSR',
        rateName: 'DAI Savings Rate',
      }
}
