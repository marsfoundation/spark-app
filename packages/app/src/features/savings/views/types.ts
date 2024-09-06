import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { MigrationInfo } from '../logic/makeMigrationInfo'
import { SavingsTokenDetails } from '../logic/useSavings'
import { Projections } from '../types'

export interface SavingsViewContentProps {
  savingsTokenDetails: SavingsTokenDetails
  migrationInfo?: MigrationInfo
  chainId: SupportedChainId
  assetsInWallet: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  opportunityProjections: Projections
  openDialog: OpenDialogFunction
}
