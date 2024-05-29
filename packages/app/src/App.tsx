import '@rainbow-me/rainbowkit/styles.css'

import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'

import { getConfig } from '@/config/wagmi'

import { queryClient } from './config/query-client'
import { useViteErrorOverlay } from './domain/errors/useViteErrorOverlay'
import { I18nAppProvider } from './domain/i18n/I18nAppProvider'
import { useStore } from './domain/state'
import { useAutoConnect } from './domain/wallet/useAutoConnect'
import { rootRouter } from './RootRouter'
import { TooltipProvider } from './ui/atoms/tooltip/Tooltip'

function App() {
  const sandboxNetwork = useStore((state) => state.sandbox.network)
  const config = getConfig(sandboxNetwork)
  if (import.meta.env.VITE_PLAYWRIGHT || import.meta.env.MODE === 'development') {
    useAutoConnect({ config })
  }
  if (import.meta.env.MODE === 'development') {
    useViteErrorOverlay()
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
          <I18nAppProvider>
            <Toaster position="top-right" containerClassName="toast-notifications" />
            <TooltipProvider delayDuration={0}>
              <RouterProvider router={rootRouter} />
            </TooltipProvider>
          </I18nAppProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
