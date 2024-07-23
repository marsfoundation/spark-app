import { getChainConfigEntry } from '@/config/chain'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DaiFromSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/dai-from-sdai/types'
import { USDCFromSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/usdc-from-sdai/types'
import { XDaiFromSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/xdai-from-sdai/types'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { mainnet } from 'viem/chains'
import { Mode } from '../types'

export interface CreateObjectivesParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  savingsInfo: SavingsInfo
  chainId: number
  receiver: CheckedAddress | undefined
  mode: Mode
}
export function createObjectives({
  formValues,
  marketInfo,
  walletInfo,
  savingsInfo,
  chainId,
  receiver,
  mode,
}: CreateObjectivesParams): (
  | DaiFromSDaiWithdrawObjective
  | USDCFromSDaiWithdrawObjective
  | XDaiFromSDaiWithdrawObjective
)[] {
  const tokenSymbol = formValues.token.symbol
  const { id: originChainId } = getChainConfigEntry(chainId)

  const isMaxSelected = formValues.isMaxSelected
  const sDaiBalance = walletInfo.findWalletBalanceForToken(marketInfo.sDAI)
  const sDaiValueEstimate = savingsInfo.convertDaiToShares({ dai: formValues.value })
  const reserveAddresses = marketInfo.reserves.map((r) => r.token.address)

  if (originChainId === mainnet.id) {
    if (tokenSymbol === marketInfo.DAI.symbol) {
      return [
        {
          type: 'daiFromSDaiWithdraw',
          dai: formValues.token,
          sDai: marketInfo.sDAI,
          value: isMaxSelected ? sDaiBalance : formValues.value,
          method: isMaxSelected ? 'redeem' : 'withdraw',
          receiver,
          reserveAddresses,
          mode,
        },
      ]
    }

    if (tokenSymbol === TokenSymbol('USDC')) {
      return isMaxSelected
        ? [
            {
              type: 'usdcFromSDaiWithdraw',
              usdc: formValues.token,
              value: sDaiBalance,
              sDai: marketInfo.sDAI,
              method: 'redeem',
              receiver,
              reserveAddresses,
              mode,
            },
          ]
        : [
            {
              type: 'usdcFromSDaiWithdraw',
              usdc: formValues.token,
              value: formValues.value,
              sDai: marketInfo.sDAI,
              method: 'withdraw',
              sDaiValueEstimate,
              receiver,
              reserveAddresses,
              mode,
            },
          ]
    }
  }

  // gnosis
  return isMaxSelected
    ? [
        {
          type: 'xDaiFromSDaiWithdraw',
          xDai: formValues.token,
          value: sDaiBalance,
          sDai: marketInfo.sDAI,
          method: 'redeem',
          receiver,
          reserveAddresses,
          mode,
        },
      ]
    : [
        {
          type: 'xDaiFromSDaiWithdraw',
          xDai: formValues.token,
          value: formValues.value,
          sDai: marketInfo.sDAI,
          method: 'withdraw',
          sDaiValueEstimate,
          receiver,
          reserveAddresses,
          mode,
        },
      ]
}
