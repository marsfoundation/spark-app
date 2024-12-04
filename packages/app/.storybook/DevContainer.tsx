import { queryClient } from '@/config/query-client'
import { getConfig } from '@/config/wagmi'
import { TooltipProvider } from '@/ui/atoms/new/tooltip/Tooltip'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { WagmiProvider } from 'wagmi'
import { StorybookErrorBoundary } from './ErrorBoundary'

interface DevContainerProps {
  children: React.ReactNode
}
/**
 * Helpful for developing connected components using Storybook.
 */
export function DevContainer({ children }: DevContainerProps) {
  const config = getConfig()

  return (
    <StorybookErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={lightTheme({
              accentColor: '#3E64EF',
              borderRadius: 'medium',
            })}
          >
            <TooltipProvider delayDuration={0}>
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </TooltipProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StorybookErrorBoundary>
  )
}

function Loading() {
  return <div>Loading...</div>
}
