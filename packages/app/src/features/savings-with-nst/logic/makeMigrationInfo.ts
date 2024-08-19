import { SavingsInfo } from '@/domain/savings-info/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DowngradeDialog } from '@/features/dialogs/migrate/downgrade/DowngradeDialog'
import { UpgradeDialog } from '@/features/dialogs/migrate/upgrade/UpgradeDialog'
import { assert } from '@/utils/assert'

export interface UseMigrationInfoParams {
  savingsNstInfo: SavingsInfo | null
  savingsDaiInfo: SavingsInfo | null
  tokensInfo: TokensInfo
  openDialog: OpenDialogFunction
}

export interface MigrationInfo {
  daiSymbol: TokenSymbol
  nstSymbol: TokenSymbol
  daiToNstUpgradeAvailable: boolean
  openDaiToNstUpgradeDialog: () => void
  openNstToDaiDowngradeDialog: () => void
  openSDaiToSNstUpgradeDialog: () => void
}

export function makeMigrationInfo({
  savingsNstInfo,
  openDialog,
  savingsDaiInfo,
  tokensInfo,
}: UseMigrationInfoParams): MigrationInfo | undefined {
  if (!savingsNstInfo || !savingsDaiInfo) {
    return undefined
  }
  const DAI = tokensInfo.DAI
  const NST = tokensInfo.NST
  const sDAI = tokensInfo.sDAI
  const sNST = tokensInfo.sNST
  assert(DAI && NST && sDAI && sNST, 'DAI, NST, sDAI and sNST tokens should be defined for migration actions')

  return {
    daiSymbol: DAI.symbol,
    nstSymbol: NST.symbol,
    daiToNstUpgradeAvailable: tokensInfo.findOneBalanceBySymbol(DAI.symbol).gt(0),
    openDaiToNstUpgradeDialog: () => {
      openDialog(UpgradeDialog, { fromToken: DAI, toToken: NST })
    },
    openNstToDaiDowngradeDialog: () => {
      openDialog(DowngradeDialog, { fromToken: NST, toToken: DAI })
    },
    openSDaiToSNstUpgradeDialog: () => {
      openDialog(UpgradeDialog, { fromToken: sDAI, toToken: sNST })
    },
  }
}
