import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { RepayObjective } from '@/features/actions/flavours/repay/types'

import { MarketInfo } from '@/domain/market-info/marketInfo'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '../../common/logic/form'

export interface UseCreateRepayObjectivesParams {
  repaymentAsset: DialogFormNormalizedData
  marketInfoIn1Epoch: MarketInfo
  marketInfoIn2Epochs: MarketInfo
  walletInfo: WalletInfo
}

export function useCreateRepayObjectives({
  repaymentAsset,
  marketInfoIn1Epoch,
  marketInfoIn2Epochs,
  walletInfo,
}: UseCreateRepayObjectivesParams): RepayObjective[] {
  const lendingPool = useContractAddress(lendingPoolAddress)

  const symbol = repaymentAsset.token.symbol

  const balance = walletInfo.findWalletBalanceForSymbol(symbol)
  const debtIn1Epoch = marketInfoIn1Epoch.findOnePositionBySymbol(symbol).borrowBalance
  const debtIn2Epochs = marketInfoIn2Epochs.findOnePositionBySymbol(symbol).borrowBalance

  const tryFullRepay = repaymentAsset.isMaxSelected && balance.gt(debtIn1Epoch)

  return [
    {
      type: 'repay',
      value: tryFullRepay ? debtIn2Epochs : repaymentAsset.value,
      requiredApproval: tryFullRepay ? debtIn1Epoch : repaymentAsset.value,
      reserve: repaymentAsset.reserve,
      useAToken: repaymentAsset.token.isAToken,
      lendingPool,
    },
  ]
}
