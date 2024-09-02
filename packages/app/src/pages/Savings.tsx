import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsContainer as SavingsContainerWithUsds } from '@/features/savings-with-usds/SavingsContainer'
import { SavingsContainer } from '@/features/savings/SavingsContainer'
import { useChainId } from 'wagmi'

export function Savings() {
  if (typeof import.meta.env.VITE_DEV_USDS_NETWORK_RPC_URL === 'string') {
    // biome-ignore lint/correctness/useHookAtTopLevel: temporary solution while developing usds
    const chainId = useChainId()
    if (chainId === USDS_DEV_CHAIN_ID) {
      return <SavingsContainerWithUsds />
    }
  }

  return <SavingsContainer />
}
