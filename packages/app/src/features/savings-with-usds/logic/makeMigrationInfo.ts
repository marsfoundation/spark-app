import { SavingsInfo } from '@/domain/savings-info/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DowngradeDialog } from '@/features/dialogs/migrate/downgrade/DowngradeDialog'
import { UpgradeDialog } from '@/features/dialogs/migrate/upgrade/UpgradeDialog'
import { assert } from '@/utils/assert'

export interface UseMigrationInfoParams {
  savingsUsdsInfo: SavingsInfo | null
  savingsDaiInfo: SavingsInfo | null
  tokensInfo: TokensInfo
  openDialog: OpenDialogFunction
}

export interface MigrationInfo {
  daiSymbol: TokenSymbol
  usdsSymbol: TokenSymbol
  daiToUsdsUpgradeAvailable: boolean
  openDaiToUsdsUpgradeDialog: () => void
  openUsdsToDaiDowngradeDialog: () => void
  openSDaiToSUsdsUpgradeDialog: () => void
}

export function makeMigrationInfo({
  savingsUsdsInfo,
  openDialog,
  savingsDaiInfo,
  tokensInfo,
}: UseMigrationInfoParams): MigrationInfo | undefined {
  if (!savingsUsdsInfo || !savingsDaiInfo) {
    return undefined
  }
  const DAI = tokensInfo.DAI
  const USDS = tokensInfo.USDS
  const sDAI = tokensInfo.sDAI
  const sUSDS = tokensInfo.sUSDS
  assert(DAI && USDS && sDAI && sUSDS, 'DAI, USDS, sDAI and sUSDS tokens should be defined for migration actions')

  return {
    daiSymbol: DAI.symbol,
    usdsSymbol: USDS.symbol,
    daiToUsdsUpgradeAvailable: tokensInfo.findOneBalanceBySymbol(DAI.symbol).gt(0),
    openDaiToUsdsUpgradeDialog: () => {
      openDialog(UpgradeDialog, { fromToken: DAI, toToken: USDS })
    },
    openUsdsToDaiDowngradeDialog: () => {
      openDialog(DowngradeDialog, { fromToken: USDS, toToken: DAI })
    },
    openSDaiToSUsdsUpgradeDialog: () => {
      openDialog(UpgradeDialog, { fromToken: sDAI, toToken: sUSDS })
    },
  }
}
