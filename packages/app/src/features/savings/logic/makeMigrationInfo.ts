import { SavingsInfo } from '@/domain/savings-info/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { upgradeDialogConfig } from '@/features/dialogs/savings/migrate/upgrade/UpgradeDialog'
import { Percentage } from '@marsfoundation/common-universal'
import { determineApyImprovement } from './determineApyImprovement'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface UseMigrationInfoParams {
  accounts: { savingsInfo: SavingsInfo, savingsToken: Token }[]
  selectedAccount: TokenSymbol
  tokensInfo: TokensInfo
  openDialog: OpenDialogFunction
}

export interface MigrationInfo {
  apyImprovement?: Percentage
  openSDaiToSUsdsUpgradeDialog: () => void
}

export function makeMigrationInfo({
  accounts,
  selectedAccount,
  openDialog,
  tokensInfo,
}: UseMigrationInfoParams): MigrationInfo | undefined {
  if (selectedAccount !== TokenSymbol('sDAI')) {
    return undefined
  }

  const sdaiAccount = accounts.find((account) => account.savingsToken.symbol === tokensInfo.sDAI?.symbol)
  const susdsAccount = accounts.find((account) => account.savingsToken.symbol === tokensInfo.sUSDS?.symbol)

  if (!sdaiAccount || !susdsAccount) {
    return undefined
  }

  return {
    apyImprovement: determineApyImprovement({ savingsUsdsInfo: susdsAccount.savingsInfo, savingsDaiInfo: sdaiAccount.savingsInfo }),
    openSDaiToSUsdsUpgradeDialog: () => {
      openDialog(upgradeDialogConfig, { fromToken: sdaiAccount.savingsToken, toToken: susdsAccount.savingsToken })
    },
  }
}
