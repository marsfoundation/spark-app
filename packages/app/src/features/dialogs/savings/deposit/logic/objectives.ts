import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DepositToSavingsObjective } from '@/features/actions/flavours/deposit-to-savings/types'
import { TransferFromUserFormNormalizedData } from '@/features/dialogs/common/logic/transfer-from-user/form'
import { raise } from '@/utils/assert'

export interface CreateObjectivesParams {
  formValues: TransferFromUserFormNormalizedData
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
