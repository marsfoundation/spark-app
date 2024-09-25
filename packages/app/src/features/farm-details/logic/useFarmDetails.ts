import { getChainConfigEntry } from '@/config/chain'
import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { NotFoundError } from '@/domain/errors/not-found'
import { Farm, FarmDetailsRowData } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { useOpenDialog } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { sandboxDialogConfig } from '@/features/dialogs/sandbox/SandboxDialog'
import { raise } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { claimDialogConfig } from '../dialogs/claim/ClaimDialog'
import { stakeDialogConfig } from '../dialogs/stake/StakeDialog'
import { unstakeDialogConfig } from '../dialogs/unstake/UnstakeDialog'
import { calculateReward } from './calculateReward'
import { FarmHistoryItem } from './historic/types'
import { useFarmHistoricData } from './historic/useFarmHistoricData'
import { useFarmDetailsParams } from './useFarmDetailsParams'

export interface UseFarmDetailsResult {
  chainId: number
  chainMismatch: boolean
  walletConnected: boolean
  farm: Farm
  farmDetailsRowData: FarmDetailsRowData
  farmHistoricData: FarmHistoryItem[]
  tokensToDeposit: TokenWithBalance[]
  hasTokensToDeposit: boolean
  earnedReward: NormalizedUnitNumber
  openStakeDialog: (initialToken: Token) => void
  openUnstakeDialog: () => void
  openClaimDialog: () => void
  openDefaultedStakeDialog: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function useFarmDetails(): UseFarmDetailsResult {
  const { timestamp } = useTimestamp()
  const walletConnected = useAccount().isConnected
  const { address: farmAddress, chainId } = useFarmDetailsParams()
  const connectedChainId = useChainId()
  const chainMismatch = walletConnected && connectedChainId !== chainId
  const { openConnectModal = () => {} } = useConnectModal()
  const openDialog = useOpenDialog()
  const chainConfig = getChainConfigEntry(chainId)

  const { farmsInfo } = useFarmsInfo({ chainId })
  const { farmHistoricData } = useFarmHistoricData({ chainId, farmAddress })
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

  const farm = farmsInfo.findFarmByAddress(farmAddress) ?? raise(new NotFoundError())
  const tokensToDeposit = farm.entryAssetsGroup.assets.map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )
  const hasTokensToDeposit = tokensToDeposit.some((token) => token.balance.gt(0))
  const mostValuableToken = sortByUsdValueWithUsdsPriority(tokensToDeposit, tokensInfo)[0]

  const earnedReward = calculateReward({
    earned: farm.earned,
    staked: farm.staked,
    rewardRate: farm.rewardRate,
    earnedTimestamp: farm.earnedTimestamp,
    periodFinish: farm.periodFinish,
    timestampInMs: timestamp * 1000,
    totalSupply: farm.totalSupply,
  })

  return {
    chainId,
    chainMismatch,
    walletConnected,
    farm,
    farmHistoricData,
    farmDetailsRowData: {
      tvl: farm.totalSupply,
      apy: farm.apy,
      depositors: farm.depositors,
    },
    tokensToDeposit,
    hasTokensToDeposit,
    earnedReward,
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
