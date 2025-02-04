import { SavingsConverter } from '@/domain/savings-converters/types'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { SavingsDialogTxOverview } from '../../common/types'
import { findUnderlyingToken } from '../../common/utils'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsConverter: SavingsConverter
  savingsToken: Token
}
export function createTxOverview({
  formValues,
  tokensInfo,
  savingsConverter,
  savingsToken,
}: CreateTxOverviewParams): SavingsDialogTxOverview {
  // the value is normalized, so assuming 1 to 1 conversion rate for USDC
  // value denominated in DAI equals to value denominated in USDC
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  const savingsTokenValue = savingsConverter.convertToShares({ assets: value })
  const stableEarnRate = NormalizedUnitNumber(value.multipliedBy(savingsConverter.apy))

  const route: TxOverviewRouteItem[] = getDepositRoute({
    formValues,
    tokensInfo,
    savingsConverter,
    savingsToken,
    savingsTokenValue,
  })

  return {
    underlyingToken: findUnderlyingToken(savingsToken, tokensInfo) ?? raise('Cannot find underlying token'),
    status: 'success',
    APY: savingsConverter.apy,
    stableEarnRate,
    route,
    skyBadgeToken: formValues.token,
    outTokenAmount: savingsTokenValue,
  }
}

export interface GetDepositRouteParams {
  formValues: TransferFromUserFormNormalizedData
  tokensInfo: TokensInfo
  savingsConverter: SavingsConverter
  savingsToken: Token
  savingsTokenValue: NormalizedUnitNumber
}
function getDepositRoute({
  formValues,
  tokensInfo,
  savingsConverter,
  savingsToken,
  savingsTokenValue,
}: GetDepositRouteParams): TxOverviewRouteItem[] {
  const value = formValues.value
  const intermediary = findUnderlyingToken(savingsToken, tokensInfo) ?? raise('Cannot find intermediary token')

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
      usdValue: savingsConverter.convertToAssets({ shares: savingsTokenValue }),
    },
  ]
}
