import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { RepayObjective } from '@/features/actions/flavours/repay/types'

import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '../../common/logic/form'

const FULL_REPAY_SCALE = 1.01
const FULL_REPAY_APPROVAL_SCALE = 1.005

export interface UseCreateRepayObjectivesParams {
  repaymentAsset: DialogFormNormalizedData
  walletInfo: WalletInfo
}

export function useCreateRepayObjectives({
  repaymentAsset,
  walletInfo,
}: UseCreateRepayObjectivesParams): RepayObjective[] {
  const lendingPool = useContractAddress(lendingPoolAddress)
  const balance = walletInfo.findWalletBalanceForSymbol(repaymentAsset.token.symbol)
  const useScaledValue = repaymentAsset.isMaxSelected && balance.gt(repaymentAsset.value)

  const scaledFormValue = scaleFormValue(repaymentAsset.value, repaymentAsset.token.decimals, FULL_REPAY_SCALE)
  // required approval has smaller gap then what we are sending to the contract that enables big time gap between approval and borrow txs
  const requiredApproval = scaleFormValue(
    repaymentAsset.value,
    repaymentAsset.token.decimals,
    FULL_REPAY_APPROVAL_SCALE,
  )

  return [
    {
      type: 'repay',
      value: useScaledValue ? scaledFormValue : repaymentAsset.value,
      requiredApproval: useScaledValue ? requiredApproval : repaymentAsset.value,
      reserve: repaymentAsset.reserve,
      useAToken: repaymentAsset.token.isAToken,
      lendingPool,
    },
  ]
}

function scaleFormValue(value: NormalizedUnitNumber, decimals: number, scale: number): NormalizedUnitNumber {
  return NormalizedUnitNumber(value.multipliedBy(scale).toFixed(decimals))
}
