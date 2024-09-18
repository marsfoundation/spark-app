import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { NotFoundError } from '@/domain/errors/not-found'
import { Farm, FarmDetailsRowData } from '@/domain/farms/types'
import { useFarmsInfo } from '@/domain/farms/useFarmsInfo'
import { useOpenDialog } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { raise } from '@/utils/assert'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { StakeDialog } from '../dialogs/stake/StakeDialog'
import { sortByUsdValueWithUsdsPriority } from '../dialogs/stake/logic/sortByUsdValueWithUsdsPriority'
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
  openStakeDialog: (initialToken: Token) => void
  openDefaultedStakeDialog: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function useFarmDetails(): UseFarmDetailsResult {
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
    openStakeDialog: (initialToken: Token) => openDialog(StakeDialog, { farm, initialToken }),
    openDefaultedStakeDialog: () =>
      mostValuableToken ? openDialog(StakeDialog, { farm, initialToken: mostValuableToken.token }) : undefined,
    openConnectModal,
    openSandboxModal(): void {
      openDialog(SandboxDialog, { mode: 'ephemeral' } as const)
    },
  }
}
