import { getInjectedNetwork } from '@/config/wagmi/getInjectedNetwork'
import { useEffect } from 'react'
import { Config } from 'wagmi'
import { switchChain } from 'wagmi/actions'

export interface UseAutoSwitchToInjectedChainParms {
  config: Config
}
export function useAutoSwitchToInjectedChain({ config }: UseAutoSwitchToInjectedChainParms): void {
  useEffect(() => {
    const injectedNetwork = getInjectedNetwork()

    if (injectedNetwork) {
      // Has to happen in the next tick for some reason.
      // Looks like otherwise the settings from wagmi take over.
      setTimeout(() => {
        void switchChain(config, { chainId: injectedNetwork.chainId })
      }, 0)
    }
  }, [config])
}
