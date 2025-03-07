import '@rainbow-me/rainbowkit/styles.css'

import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'

import { getConfig } from '@/config/wagmi'

import { rootRouter } from './RootRouter'
import { queryClient } from './config/query-client'
import { useViteErrorOverlay } from './domain/errors/useViteErrorOverlay'
import { useAutoSwitchToInjectedChain } from './domain/hooks/useAutoSwitchToInjectedChain'
import { useStore } from './domain/state'
import { useAutoConnect } from './domain/wallet/useAutoConnect'
import { TooltipProvider } from './ui/atoms/tooltip/Tooltip'

function App() {
  const sandboxNetwork = useStore((state) => state.sandbox.network)
  const config = getConfig(sandboxNetwork)
  if (import.meta.env.VITE_PLAYWRIGHT === '1') {
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useAutoConnect({ config })
  }
  if (import.meta.env.MODE === 'development') {
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useViteErrorOverlay()
  }

  if (import.meta.env.VITE_FEATURE_RPC_INJECTION_VIA_URL === '1') {
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useAutoSwitchToInjectedChain({ config })
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#3E64EF',
            borderRadius: 'medium',
          })}
        >
          <TooltipProvider delayDuration={0}>
            <RouterProvider router={rootRouter} />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
