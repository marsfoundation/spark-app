import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SavingsTokenDetails } from '../logic/useSavings'

export interface SavingsViewContentProps {
  savingsTokenDetails: SavingsTokenDetails
  chainId: SupportedChainId
  assetsInWallet: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  openDialog: OpenDialogFunction
}
