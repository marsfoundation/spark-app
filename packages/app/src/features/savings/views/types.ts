import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { MigrationInfo } from '../logic/makeMigrationInfo'
import { SavingsMeta } from '../logic/makeSavingsMeta'
import { SavingsAccountEntryAssets, SavingsTokenDetails } from '../logic/useSavings'

export interface SavingsViewContentProps {
  savingsTokenDetails: SavingsTokenDetails
  migrationInfo?: MigrationInfo
  entryAssets: SavingsAccountEntryAssets[]
  originChainId: SupportedChainId
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  savingsMeta: SavingsMeta
  openDialog: OpenDialogFunction
  showConvertDialogButton: boolean
  savingsChartsInfo: UseSavingsChartsInfoQueryResult
}
