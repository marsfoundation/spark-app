import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TokenWithBalanceFormNormalizedData } from '@/features/dialogs/common/logic/asset-balance/form'
import { MigrateDialogTxOverview } from '../types'

export interface CreateTxOverviewParams {
  formValues: TokenWithBalanceFormNormalizedData
  tokensInfo: TokensInfo
  outputToken: Token
  savingsDaiInfo: SavingsInfo
  savingsUsdsInfo: SavingsInfo
}
export function createTxOverview({
  formValues,
  tokensInfo,
  outputToken,
  savingsDaiInfo,
  savingsUsdsInfo,
}: CreateTxOverviewParams): MigrateDialogTxOverview {
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  // sdai -> susds
  if (formValues.token.symbol === tokensInfo.sDAI?.symbol) {
    const apyChange = { current: savingsDaiInfo.apy, updated: savingsUsdsInfo.apy }
    const daiAmount = savingsDaiInfo.convertToAssets({ shares: value })
    const route = [
      {
        token: formValues.token,
        value,
        usdValue: daiAmount,
      },
      {
        token: outputToken,
        value: savingsUsdsInfo.convertToShares({ assets: daiAmount }),
        usdValue: daiAmount,
      },
    ]

    return { status: 'success', apyChange, route }
  }

  // dai <-> usds
  const route = [
    {
      token: formValues.token,
      value,
      usdValue: value,
    },
    {
      token: outputToken,
      value,
      usdValue: value,
    },
  ]

  return { status: 'success', route }
}
