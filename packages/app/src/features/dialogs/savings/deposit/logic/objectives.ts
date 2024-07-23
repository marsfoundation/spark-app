import { getChainConfigEntry } from '@/config/chain'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { DaiToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/dai-to-sdai/types'
import { USDCToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/usdc-to-sdai/types'
import { XDaiToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/xdai-to-sdai/types'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { mainnet } from 'viem/chains'

export interface CreateObjectivesParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  chainId: number
}
export function createObjectives({
  formValues,
  marketInfo,
  chainId,
}: CreateObjectivesParams): (DaiToSDaiDepositObjective | USDCToSDaiDepositObjective | XDaiToSDaiDepositObjective)[] {
  const tokenSymbol = formValues.token.symbol
  const { id: originChainId } = getChainConfigEntry(chainId)

  if (originChainId === mainnet.id) {
    if (tokenSymbol === marketInfo.DAI.symbol) {
      return [
        {
          type: 'daiToSDaiDeposit',
          value: formValues.value,
          dai: formValues.token,
          sDai: marketInfo.sDAI,
        },
      ]
    }

    if (tokenSymbol === TokenSymbol('USDC')) {
      return [
        {
          type: 'usdcToSDaiDeposit',
          value: formValues.value,
          usdc: formValues.token,
          sDai: marketInfo.sDAI,
        },
      ]
    }
  }

  // gnosis
  return [
    {
      type: 'xDaiToSDaiDeposit',
      value: formValues.value,
      xDai: formValues.token,
      sDai: marketInfo.sDAI,
    },
  ]
}
