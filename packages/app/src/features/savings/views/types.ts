import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { MigrationInfo } from '../logic/makeMigrationInfo'
import { SavingsMeta } from '../logic/makeSavingsMeta'
import { AssetInWallet, SavingsTokenDetails } from '../logic/useSavings'
import { Projections } from '../types'
import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'

export interface SavingsViewContentProps {
  savingsTokenDetails: SavingsTokenDetails
  migrationInfo?: MigrationInfo
  assetsInWallet: AssetInWallet[]
  originChainId: SupportedChainId
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  opportunityProjections: Projections
  savingsMeta: SavingsMeta
  openDialog: OpenDialogFunction
  savingsChartsInfo: UseSavingsChartsInfoQueryResult
}
