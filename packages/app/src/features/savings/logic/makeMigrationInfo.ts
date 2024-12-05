import { SavingsInfo } from '@/domain/savings-info/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { downgradeDialogConfig } from '@/features/dialogs/savings/migrate/downgrade/DowngradeDialog'
import { upgradeDialogConfig } from '@/features/dialogs/savings/migrate/upgrade/UpgradeDialog'
import { assert } from '@/utils/assert'
import { Percentage } from '@marsfoundation/common-universal'
import { determineApyImprovement } from './determineApyImprovement'

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
  apyImprovement?: Percentage
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
    apyImprovement: determineApyImprovement({ savingsUsdsInfo, savingsDaiInfo }),
    openDaiToUsdsUpgradeDialog: () => {
      openDialog(upgradeDialogConfig, { fromToken: DAI, toToken: USDS })
    },
    openUsdsToDaiDowngradeDialog: () => {
      openDialog(downgradeDialogConfig, { fromToken: USDS, toToken: DAI })
    },
    openSDaiToSUsdsUpgradeDialog: () => {
      openDialog(upgradeDialogConfig, { fromToken: sDAI, toToken: sUSDS })
    },
  }
}
