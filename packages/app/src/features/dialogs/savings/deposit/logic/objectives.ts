import { getChainConfigEntry } from '@/config/chain'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { MakerStableToSavingsObjective } from '@/features/actions/flavours/native-sdai-deposit/maker-stables/types'
import { USDCToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/usdc-to-sdai/types'
import { XDaiToSDaiDepositObjective } from '@/features/actions/flavours/native-sdai-deposit/xdai-to-sdai/types'
import { raise } from '@/utils/assert'
import { mainnet } from 'viem/chains'
import { SavingsDialogFormNormalizedData } from '../../common/logic/form'

export interface CreateObjectivesParams {
  formValues: SavingsDialogFormNormalizedData
  tokensInfo: TokensInfo
  type: 'sdai' | 'snst'
  chainId: number
}
export function createObjectives({
  formValues,
  tokensInfo,
  type,
  chainId,
}: CreateObjectivesParams): (
  | MakerStableToSavingsObjective
  | USDCToSDaiDepositObjective
  | XDaiToSDaiDepositObjective
)[] {
  const tokenSymbol = formValues.token.symbol
  const { id: originChainId } = getChainConfigEntry(chainId)

  const savingsToken = (type === 'sdai' ? tokensInfo.sDAI : tokensInfo.sNST) ?? raise('Cannot find target token')

  if (originChainId === mainnet.id) {
    if (tokenSymbol === tokensInfo.DAI?.symbol || tokenSymbol === tokensInfo.NST?.symbol) {
      return [
        {
          type: 'makerStableToSavings',
          value: formValues.value,
          stableToken: formValues.token,
          savingsToken,
        },
      ]
    }

    if (tokenSymbol === TokenSymbol('USDC')) {
      return [
        {
          type: 'usdcToSDaiDeposit',
          value: formValues.value,
          usdc: formValues.token,
          sDai: savingsToken,
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
      sDai: savingsToken,
    },
  ]
}
