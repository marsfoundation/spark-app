import { StoryFn } from '@storybook/react'
import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { custom, encodeFunctionResult, zeroAddress } from 'viem'
import { WagmiProvider, createConfig, useAccount, useConnect } from 'wagmi'

import { I18nAppProvider } from '@/domain/i18n/I18nAppProvider'
import { TooltipProvider } from '@/ui/atoms/tooltip/Tooltip'

import { DevContainer } from './DevContainer'
import { erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { mock } from 'wagmi/connectors'

export function WithTooltipProvider() {
  return function WithTooltipProvider(Story: StoryFn) {
    return (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    )
  }
}

export function WithClassname(classname: string) {
  return function WithClassname(Story: StoryFn) {
    return (
      <div className={classname}>
        <Story />
      </div>
    )
  }
}

export function WithDevContainer() {
  return function WithDevContainer(Story: StoryFn) {
    return (
      <DevContainer>
        <Story />
      </DevContainer>
    )
  }
}

export function ZeroAllowanceWagmiDecorator() {
  const config = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: custom({
        request: async (): Promise<string> => {
          return encodeFunctionResult({
            abi: erc20Abi,
            functionName: 'allowance',
            result: 0n,
          })
        },
      }),
    },
    connectors: [
      mock({
        accounts: [zeroAddress],
      }),
    ],
    batch: {
      multicall: false,
    },
  })

  // explicitly retries connection if it fails when auto connecting. This is the case for incognito mode
  function ForceConnectWrapper({ children }: { children: React.ReactNode }) {
    const { connect, connectors } = useConnect()
    const { address } = useAccount()
    useEffect(() => {
      if (!address) {
        connect({
          connector: connectors[0]!,
        })
      }
    }, [address, connect, connectors])

    if (!address) {
      return <div> Loading account </div>
    }
    return <>{children}</>
  }

  return function ZeroAllowanceWagmiDecorator(Story: StoryFn) {
    return (
      <WagmiProvider config={config}>
        <ForceConnectWrapper>
          <Story />
        </ForceConnectWrapper>
      </WagmiProvider>
    )
  }
}

export function WithI18n() {
  return function WithI18n(Story: StoryFn) {
    return (
      <I18nAppProvider>
        <Story />
      </I18nAppProvider>
    )
  }
}

export function WithQueryClient(config?: QueryClientConfig) {
  const queryClient = new QueryClient(config)

  return function WithQueryClient(Story: StoryFn) {
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  }
}
