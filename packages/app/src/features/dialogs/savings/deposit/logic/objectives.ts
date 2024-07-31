import { getChainConfigEntry } from '@/config/chain'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { DaiToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/dai-to-sdai/types'
import { USDCToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/usdc-to-sdai/types'
import { XDaiToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/xdai-to-sdai/types'
import { mainnet } from 'viem/chains'
import { SavingsDialogFormNormalizedData } from '../../common/logic/form'
import { raise } from '@/utils/assert'

export interface CreateObjectivesParams {
  formValues: SavingsDialogFormNormalizedData
  tokensInfo: TokensInfo
  chainId: number
}
export function createObjectives({
  formValues,
  tokensInfo,
  chainId,
}: CreateObjectivesParams): (DaiToSDaiDepositObjective | USDCToSDaiDepositObjective | XDaiToSDaiDepositObjective)[] {
  const tokenSymbol = formValues.token.symbol
  const { id: originChainId } = getChainConfigEntry(chainId)

  if (originChainId === mainnet.id) {
    if (tokenSymbol === tokensInfo.DAI?.symbol) {
      return [
        {
          type: 'daiToSDaiDeposit',
          value: formValues.value,
          dai: formValues.token,
          sDai: tokensInfo.sDAI ?? raise('sDAI token not found'),
        },
      ]
    }

    if (tokenSymbol === TokenSymbol('USDC')) {
      return [
        {
          type: 'usdcToSDaiDeposit',
          value: formValues.value,
          usdc: formValues.token,
          sDai: tokensInfo.sDAI ?? raise('sDAI token not found'),
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
      sDai: tokensInfo.sDAI ?? raise('sDAI token not found'),
    },
  ]
}
