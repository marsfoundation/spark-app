import { InterestBearingConverter, SavingsAccountRepository } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsAccounts: SavingsAccountRepository
  savingsToken: Token
}
export function createTxOverview({
  formValues,
  tokensInfo,
  savingsAccounts,
  savingsToken,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  const converter = savingsAccounts.findOneBySavingsToken(savingsToken).converter

  const [tokenValue, savingsTokenValue] = (() => {
    if (formValues.isMaxSelected) {
      const savingsTokenValue = tokensInfo.findOneTokenWithBalanceBySymbol(savingsToken.symbol).balance
      const tokenValue = converter.convertToAssets({ shares: savingsTokenValue })

      return [tokenValue, savingsTokenValue]
    }

    const tokenValue = formValues.value
    const savingsTokenValue = converter.convertToShares({ assets: tokenValue })
    return [tokenValue, savingsTokenValue]
  })()

  if (tokenValue.eq(0)) {
    return { status: 'no-overview' }
  }

  const savingsRate = NormalizedUnitNumber(savingsTokenValue.multipliedBy(converter.apy))
  const route = getWithdrawRoute({
    formValues,
    tokensInfo,
    converter,
    savingsToken,
    savingsTokenValue,
  })

  return {
    baseStable:
      (savingsToken.symbol === tokensInfo.sDAI?.symbol ? tokensInfo.DAI : tokensInfo.USDS) ??
      raise('Cannot find stable token'),
    status: 'success',
    APY: converter.apy,
    stableEarnRate: savingsRate,
    route,
    skyBadgeToken: formValues.token,
    outTokenAmount: tokenValue,
  }
}

export interface GetWithdrawRouteParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  converter: InterestBearingConverter
  savingsToken: Token
  savingsTokenValue: NormalizedUnitNumber
}
function getWithdrawRoute({
  formValues,
  tokensInfo,
  converter,
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
      usdValue: converter.convertToAssets({ shares: savingsTokenValue }),
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
