import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { raise } from '@/utils/assert'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
  savingsToken: Token
}
export function createTxOverview({
  formValues,
  tokensInfo,
  savingsInfo,
  savingsToken,
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
}
function getWithdrawRoute({
  formValues,
  tokensInfo,
  savingsInfo,
  savingsToken,
  savingsTokenValue,
}: GetWithdrawRouteParams): TxOverviewRouteItem[] {
  const value = formValues.value
  const intermediary =
    (savingsToken.symbol === tokensInfo.sDAI?.symbol ? tokensInfo.DAI : tokensInfo.USDS) ??
    raise('Cannot find intermediary token')

  return [
    {
      token: savingsToken,
      value: savingsTokenValue,
      usdValue: savingsInfo.convertToAssets({ shares: savingsTokenValue }),
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
