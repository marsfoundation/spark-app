import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { RepayObjective } from '@/features/actions/flavours/repay/types'

import { DialogFormNormalizedData } from '../../common/logic/form'

const FULL_REPAY_SCALE = 1.01
const FULL_REPAY_APPROVAL_SCALE = 1.005

interface UseCreateRepayObjectivesOptions {
  all?: boolean
}

export function useCreateRepayObjectives(
  formValues: DialogFormNormalizedData,
  { all = false }: UseCreateRepayObjectivesOptions,
): RepayObjective[] {
  const lendingPool = useContractAddress(lendingPoolAddress)
  const scaledFormValue = scaleFormValue(formValues.value, formValues.token.decimals, FULL_REPAY_SCALE)
  // required approval has smaller gap then what we are sending to the contract that enables big time gap between approval and borrow txs
  const requiredApproval = scaleFormValue(formValues.value, formValues.token.decimals, FULL_REPAY_APPROVAL_SCALE)

  return [
    {
      type: 'repay',
      value: all ? scaledFormValue : formValues.value,
      requiredApproval: all ? requiredApproval : formValues.value,
      reserve: formValues.reserve,
      useAToken: formValues.token.isAToken,
      lendingPool,
    },
  ]
}

function scaleFormValue(value: NormalizedUnitNumber, decimals: number, scale: number): NormalizedUnitNumber {
  return NormalizedUnitNumber(value.multipliedBy(scale).toFixed(decimals))
}
