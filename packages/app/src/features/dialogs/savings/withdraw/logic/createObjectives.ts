import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { WithdrawFromSavingsObjective } from '@/features/actions/flavours/withdraw-from-savings/types'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { raise } from '@/utils/assert'
import { Mode } from '../types'

export interface CreateObjectivesParams {
  formValues: DialogFormNormalizedData
  tokensInfo: TokensInfo
  receiver: CheckedAddress | undefined
  mode: Mode
}
export function createObjectives({
  formValues,
  tokensInfo,
  receiver,
  mode,
}: CreateObjectivesParams): WithdrawFromSavingsObjective[] {
  const isMaxSelected = formValues.isMaxSelected
  const savingsToken = tokensInfo.sDAI ?? raise('Savings token is not available')
  const sDaiBalance = tokensInfo.findOneBalanceBySymbol(savingsToken.symbol)

  return [
    {
      type: 'withdrawFromSavings',
      token: formValues.token,
      amount: isMaxSelected ? sDaiBalance : formValues.value,
      isMax: isMaxSelected,
      savingsToken,
      receiver,
      mode,
    },
  ]
}
