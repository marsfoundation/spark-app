import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DepositToSavingsObjective } from '@/features/actions/flavours/deposit-to-savings/types'
import { raise } from '@/utils/assert'
import { SavingsDialogFormNormalizedData } from '../../common/logic/form'

export interface CreateObjectivesParams {
  formValues: SavingsDialogFormNormalizedData
  tokensInfo: TokensInfo
  type: 'sdai' | 'snst'
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
