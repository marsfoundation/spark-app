import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsContainer as SavingsContainerWithNst } from '@/features/savings-with-nst/SavingsContainer'
import { SavingsContainer } from '@/features/savings/SavingsContainer'
import { useChainId } from 'wagmi'

export function Savings() {
  if (typeof import.meta.env.VITE_DEV_NST_NETWORK_RPC_URL === 'string') {
    // biome-ignore lint/correctness/useHookAtTopLevel: temporary solution while developing nst
    const chainId = useChainId()
    if (chainId === NST_DEV_CHAIN_ID) {
      return <SavingsContainerWithNst />
    }
  }

  return <SavingsContainer />
}
