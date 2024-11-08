import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'

import { getConfig } from '@/config/wagmi'

import { rootRouter } from './RootRouter'
import { queryClient } from './config/query-client'
import { useViteErrorOverlay } from './domain/errors/useViteErrorOverlay'
import { I18nAppProvider } from './domain/i18n/I18nAppProvider'
import { useStore } from './domain/state'
import { useAutoConnect } from './domain/wallet/useAutoConnect'
import { TooltipProvider } from './ui/atoms/tooltip/Tooltip'
import { AppBg } from './ui/atoms/app-bg/AppBg'
import { lastSepoliaDynamic } from './config/chain/constants'

function App() {
  const sandboxNetwork = useStore((state) => state.sandbox.network)
  const config = getConfig(sandboxNetwork)
  if (import.meta.env.VITE_PLAYWRIGHT === '1' || import.meta.env.MODE === 'development') {
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useAutoConnect({ config })
  }
  if (import.meta.env.MODE === 'development') {
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    useViteErrorOverlay()
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || '',
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: [lastSepoliaDynamic],
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <I18nAppProvider>
              <AppBg />

              <Toaster position="top-right" containerClassName="toast-notifications" />
              <TooltipProvider delayDuration={0}>
                <RouterProvider router={rootRouter} />
              </TooltipProvider>
            </I18nAppProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}

export default App
