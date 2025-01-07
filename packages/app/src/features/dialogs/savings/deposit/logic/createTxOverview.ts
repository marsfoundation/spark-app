import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
  type: 'sdai' | 'susds'
}
export function createTxOverview({
  formValues,
  tokensInfo,
  savingsInfo,
  type,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  // the value is normalized, so assuming 1 to 1 conversion rate for USDC
  // value denominated in DAI equals to value denominated in USDC
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  const savingsTokenValue = savingsInfo.convertToShares({ assets: value })
  const savingsToken = (type === 'sdai' ? tokensInfo.sDAI : tokensInfo.sUSDS) ?? raise('Cannot find savings token')
  const stableEarnRate = NormalizedUnitNumber(value.multipliedBy(savingsInfo.apy))

  const route: TxOverviewRouteItem[] = getDepositRoute({
    formValues,
    tokensInfo,
    savingsInfo,
    savingsToken,
    savingsTokenValue,
  })

  return {
    baseStable: (type === 'sdai' ? tokensInfo.DAI : tokensInfo.USDS) ?? raise('Cannot find stable token'),
    status: 'success',
    APY: savingsInfo.apy,
    stableEarnRate,
    route,
    skyBadgeToken: formValues.token,
    outTokenAmount: savingsTokenValue,
  }
}

export interface GetDepositRouteParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
  savingsToken: Token
  savingsTokenValue: NormalizedUnitNumber
}
function getDepositRoute({
  formValues,
  tokensInfo,
  savingsInfo,
  savingsToken,
  savingsTokenValue,
}: GetDepositRouteParams): TxOverviewRouteItem[] {
  const value = formValues.value
  const intermediary =
    (savingsToken.symbol === tokensInfo.sDAI?.symbol ? tokensInfo.DAI : tokensInfo.USDS) ??
    raise('Cannot find intermediary token')

  return [
    ...(intermediary.symbol !== formValues.token.symbol
      ? [
          {
            token: formValues.token,
            usdValue: value,
            value,
          },
        ]
      : []),
    {
      token: intermediary,
      usdValue: value,
      value,
    },
    {
      token: savingsToken,
      value: savingsTokenValue,
      usdValue: savingsInfo.convertToAssets({ shares: savingsTokenValue }),
    },
  ]
}
