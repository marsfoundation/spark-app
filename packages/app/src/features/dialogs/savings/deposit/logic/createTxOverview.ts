import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@/utils/assert'
import { SavingsDialogFormNormalizedData } from '../../common/logic/form'
import { RouteItem, SavingsDialogTxOverview } from '../../common/types'

export interface CreateTxOverviewParams {
  formValues: SavingsDialogFormNormalizedData
  tokensInfo: TokensInfo
  savingsInfo: SavingsInfo
  type: 'sdai' | 'snst'
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

  const route: RouteItem[] = getDepositRoute({ formValues, tokensInfo, savingsInfo, savingsToken, savingsTokenValue })

  return {
    baseStable: (type === 'sdai' ? tokensInfo.DAI : tokensInfo.USDS) ?? raise('Cannot find stable token'),
    status: 'success',
    APY: savingsInfo.apy,
    stableEarnRate,
    route,
    makerBadgeToken: formValues.token,
    outTokenAmount: savingsTokenValue,
  }
}

export interface GetDepositRouteParams {
  formValues: SavingsDialogFormNormalizedData
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
}: GetDepositRouteParams): RouteItem[] {
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
