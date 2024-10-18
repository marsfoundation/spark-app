import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { raise } from '@/utils/assert'
import { SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
  savingsToken: Token
  timestamp: number
}
export function createTxOverview({
  formValues,
  tokensInfo,
  savingsInfo,
  savingsToken,
  timestamp,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  const [tokenValue, savingsTokenValue] = (() => {
    if (formValues.isMaxSelected) {
      const savingsTokenValue = tokensInfo.findOneTokenWithBalanceBySymbol(savingsToken.symbol).balance
      const tokenValue = savingsInfo.convertToAssets({ shares: savingsTokenValue })

      return [tokenValue, savingsTokenValue]
    }

    const tokenValue = formValues.value
    const savingsTokenValue = savingsInfo.convertToShares({ assets: tokenValue })
    return [tokenValue, savingsTokenValue]
  })()

  if (tokenValue.eq(0)) {
    return { status: 'no-overview' }
  }

  const savingsRate = NormalizedUnitNumber(savingsTokenValue.multipliedBy(savingsInfo.apy))
  const route = getWithdrawRoute({
    formValues,
    tokensInfo,
    savingsInfo,
    savingsToken,
    savingsTokenValue,
    timestamp,
  })

  return {
    baseStable:
      (savingsToken.symbol === tokensInfo.sDAI?.symbol ? tokensInfo.DAI : tokensInfo.USDS) ??
      raise('Cannot find stable token'),
    status: 'success',
    APY: savingsInfo.apy,
    stableEarnRate: savingsRate,
    route,
    skyBadgeToken: formValues.token,
    outTokenAmount: tokenValue,
  }
}

export interface GetWithdrawRouteParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
  savingsToken: Token
  savingsTokenValue: NormalizedUnitNumber
  timestamp: number
}
function getWithdrawRoute({
  formValues,
  tokensInfo,
  savingsInfo,
  savingsToken,
  savingsTokenValue,
  timestamp,
}: GetWithdrawRouteParams): TxOverviewRouteItem[] {
  const value = formValues.value
  const intermediary =
    (savingsToken.symbol === tokensInfo.sDAI?.symbol ? tokensInfo.DAI : tokensInfo.USDS) ??
    raise('Cannot find intermediary token')

  return [
    {
      token: savingsToken,
      value: savingsTokenValue,
      usdValue: savingsInfo.predictAssetsAmount({ shares: savingsTokenValue, timestamp }),
    },
    {
      token: intermediary,
      value,
      usdValue: value,
    },
    ...(intermediary.symbol !== formValues.token.symbol
      ? [
          {
            token: formValues.token,
            value,
            usdValue: value,
          },
        ]
      : []),
  ]
}
