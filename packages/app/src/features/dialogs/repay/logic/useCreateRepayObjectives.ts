import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { RepayObjective } from '@/features/actions/flavours/repay/types'

import { GetRepayMaxValueParams, getRepayMaxValue } from '@/domain/action-max-value-getters/getRepayMaxValue'
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
  const getRepayMaxValueIn1EpochParams: GetRepayMaxValueParams = {
    user: {
      balance,
      debt: marketInfoIn1Epoch.findOnePositionBySymbol(symbol).borrowBalance,
    },
    asset: {
      status: marketInfoIn1Epoch.findOnePositionBySymbol(symbol).reserve.status,
      isNativeAsset: symbol === marketInfoIn1Epoch.nativeAssetInfo.nativeAssetSymbol,
    },
    chain: {
      minRemainingNativeAsset: marketInfoIn1Epoch.nativeAssetInfo.minRemainingNativeAssetBalance,
    },
  }

  const repayMaxValueIn1Epoch = getRepayMaxValue(getRepayMaxValueIn1EpochParams)
  const repayMaxValueIn2Epochs = getRepayMaxValue({
    ...getRepayMaxValueIn1EpochParams,
    user: {
      balance,
      debt: marketInfoIn2Epochs.findOnePositionBySymbol(symbol).borrowBalance,
    },
  })

  const tryFullRepay = repaymentAsset.isMaxSelected && balance.gt(repayMaxValueIn1Epoch)

  return [
    {
      type: 'repay',
      value: tryFullRepay ? repayMaxValueIn2Epochs : repaymentAsset.value,
      requiredApproval: tryFullRepay ? repayMaxValueIn1Epoch : repaymentAsset.value,
      reserve: repaymentAsset.reserve,
      useAToken: repaymentAsset.token.isAToken,
      lendingPool,
    },
  ]
}
