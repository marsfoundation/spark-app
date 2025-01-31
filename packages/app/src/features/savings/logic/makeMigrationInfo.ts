import { SavingsAccountRepository } from '@/domain/savings-info/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { upgradeDialogConfig } from '@/features/dialogs/savings/migrate/upgrade/UpgradeDialog'
import { Percentage } from '@marsfoundation/common-universal'
import { determineApyImprovement } from './determineApyImprovement'

export interface UseMigrationInfoParams {
  selectedAccount: TokenSymbol
  savingsAccounts: SavingsAccountRepository
  openDialog: OpenDialogFunction
}

export interface MigrationInfo {
  apyImprovement?: Percentage
  openSDaiToSUsdsUpgradeDialog: () => void
}

export function makeMigrationInfo({
  selectedAccount,
  savingsAccounts,
  openDialog,
}: UseMigrationInfoParams): MigrationInfo | undefined {
  if (selectedAccount !== TokenSymbol('sDAI')) {
    return undefined
  }

  const sdaiAccount = savingsAccounts.findBySavingsTokenSymbol(TokenSymbol('sDAI'))
  const susdsAccount = savingsAccounts.findBySavingsTokenSymbol(TokenSymbol('sUSDS'))

  if (!sdaiAccount || !susdsAccount) {
    return undefined
  }

  return {
    apyImprovement: determineApyImprovement({
      savingsUsdsInfo: susdsAccount.converter,
      savingsDaiInfo: sdaiAccount.converter,
    }),
    openSDaiToSUsdsUpgradeDialog: () => {
      openDialog(upgradeDialogConfig, { fromToken: sdaiAccount.savingsToken, toToken: susdsAccount.savingsToken })
    },
  }
}
