import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { RepayObjective } from '@/features/actions/flavours/repay/types'

import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import BigNumber from 'bignumber.js'
import { DialogFormNormalizedData } from '../../common/logic/form'

const FULL_REPAY_SCALE = 1.01
const FULL_REPAY_APPROVAL_SCALE = 1.005

interface UseCreateRepayObjectivesOptions {
  all?: boolean
}

export function useCreateRepayObjectives(
  formValues: DialogFormNormalizedData,
  { all = false }: UseCreateRepayObjectivesOptions,
  walletInfo: WalletInfo,
): RepayObjective[] {
  const maxAvailable = walletInfo.findWalletBalanceForSymbol(formValues.token.symbol)
  const lendingPool = useContractAddress(lendingPoolAddress)
  // we need to make sure that current repay value is not bigger than max available
  const scaledFormValue = NormalizedUnitNumber(
    BigNumber.min(scaleFormValue(formValues.value, formValues.token.decimals, FULL_REPAY_SCALE), maxAvailable),
  )
  // We request for full repay approval but actual, required approval is smaller.
  // This enables big time gap between approval and borrow txs.
  const requiredApproval = NormalizedUnitNumber(
    BigNumber.min(scaleFormValue(formValues.value, formValues.token.decimals, FULL_REPAY_APPROVAL_SCALE), maxAvailable),
  )

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
