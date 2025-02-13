import { SavingsAccountRepository } from '@/domain/savings-converters/types'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { MigrateDialogTxOverview } from '../types'

export interface CreateTxOverviewParams {
  formValues: TransferFromUserFormNormalizedData
  savingsAccounts: SavingsAccountRepository
  tokenRepository: TokenRepository
  outputToken: Token
}
export function createTxOverview({
  formValues,
  savingsAccounts,
  tokenRepository,
  outputToken,
}: CreateTxOverviewParams): MigrateDialogTxOverview {
  const value = formValues.value
  if (value.eq(0)) {
    return { status: 'no-overview' }
  }

  // sdai -> susds
  if (formValues.token.symbol === tokenRepository.sDAI?.symbol) {
    const sdaiConverter = savingsAccounts.findOneBySavingsTokenSymbol(TokenSymbol('sDAI')).converter
    const susdsConverter = savingsAccounts.findOneBySavingsTokenSymbol(TokenSymbol('sUSDS')).converter

    const apyChange = { current: sdaiConverter.apy, updated: susdsConverter.apy }
    const daiAmount = sdaiConverter.convertToAssets({ shares: value })
    const route = [
      {
        token: formValues.token,
        value,
        usdValue: daiAmount,
      },
      {
        token: outputToken,
        value: susdsConverter.convertToShares({ assets: daiAmount }),
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
