import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { NotFoundError } from '@/domain/errors/not-found'
import { Farm } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { useSandboxPageRedirect } from '@/domain/sandbox/useSandboxPageRedirect'
import { useOpenDialog } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { sandboxDialogConfig } from '@/features/dialogs/sandbox/SandboxDialog'
import { raise } from '@/utils/assert'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { claimDialogConfig } from '../dialogs/claim/ClaimDialog'
import { stakeDialogConfig } from '../dialogs/stake/StakeDialog'
import { unstakeDialogConfig } from '../dialogs/unstake/UnstakeDialog'
import { FarmHistoryItem } from './historic/types'
import { useFarmHistoricData } from './historic/useFarmHistoricData'
import { useFarmDetailsParams } from './useFarmDetailsParams'

export interface UseFarmDetailsResult {
  chainId: number
  chainMismatch: boolean
  walletConnected: boolean
  farm: Farm
  farmHistoricData: FarmHistoryItem[]
  tokensToDeposit: TokenWithBalance[]
  isFarmActive: boolean
  hasTokensToDeposit: boolean
  openStakeDialog: (initialToken: Token) => void
  openUnstakeDialog: () => void
  openClaimDialog: () => void
  openDefaultedStakeDialog: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function useFarmDetails(): UseFarmDetailsResult {
  const walletConnected = useAccount().isConnected
  const params = useFarmDetailsParams()
  const { address: farmAddress, chainId } = params

  const connectedChainId = useChainId()
  const chainMismatch = walletConnected && connectedChainId !== chainId
  const { openConnectModal = () => {} } = useConnectModal()
  const openDialog = useOpenDialog()
  const chainConfig = getChainConfigEntry(chainId)

  useSandboxPageRedirect({
    basePath: paths.farmDetails,
    fallbackPath: paths.farms,
    basePathParams: params,
  })

  const { farmsInfo } = useFarmsInfo({ chainId })
  const { farmHistoricData } = useFarmHistoricData({ chainId, farmAddress })
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

  const farm = farmsInfo.findFarmByAddress(farmAddress) ?? raise(new NotFoundError())
  const tokensToDeposit = farm.entryAssetsGroup.assets.map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )
  const hasTokensToDeposit = tokensToDeposit.some((token) => token.balance.gt(0))
  const mostValuableToken = sortByUsdValueWithUsdsPriority(tokensToDeposit, tokensInfo)[0]

  return {
    chainId,
    chainMismatch,
    walletConnected,
    farm,
    farmHistoricData,
    tokensToDeposit,
    hasTokensToDeposit,
    isFarmActive: farm.staked.gt(0) || farm.earned.gt(0),
    openUnstakeDialog: () => openDialog(unstakeDialogConfig, { farm, initialToken: farm.stakingToken }),
    openStakeDialog: (initialToken: Token) => openDialog(stakeDialogConfig, { farm, initialToken }),
    openDefaultedStakeDialog: () =>
      mostValuableToken ? openDialog(stakeDialogConfig, { farm, initialToken: mostValuableToken.token }) : undefined,
    openClaimDialog: () => openDialog(claimDialogConfig, { farm }),
    openConnectModal,
    openSandboxModal(): void {
      openDialog(sandboxDialogConfig, { mode: 'ephemeral' } as const)
    },
  }
}
