import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DepositToSavingsObjective } from '@/features/actions/flavours/deposit-to-savings/types'
import { TransferAmountFormNormalizedData } from '@/features/dialogs/common/logic/transfer-amount/form'
import { raise } from '@/utils/assert'

export interface CreateObjectivesParams {
  formValues: TransferAmountFormNormalizedData
  tokensInfo: TokensInfo
  type: 'sdai' | 'susds'
}
export function createObjectives({
  formValues,
  tokensInfo,
  type,
}: CreateObjectivesParams): DepositToSavingsObjective[] {
  const savingsToken = (type === 'sdai' ? tokensInfo.sDAI : tokensInfo.sUSDS) ?? raise('Cannot find target token')

  return [
    {
      type: 'depositToSavings',
      value: formValues.value,
      token: formValues.token,
      savingsToken,
    },
  ]
}
