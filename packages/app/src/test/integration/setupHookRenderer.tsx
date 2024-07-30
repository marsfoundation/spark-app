import { QueryClient } from '@tanstack/react-query'
import { RenderHookResult, renderHook } from '@testing-library/react'
import { Chain } from 'wagmi/chains'

import { CheckedAddress } from '@/domain/types/CheckedAddress'

import { TestInvalidationManager } from './TestInvalidationManager'
import { TestingWrapper } from './TestingWrapper'
import { makeMockTransport } from './mockTransport'
import { RpcHandler } from './mockTransport/types'
import { queryClient as defaultQueryClient } from './query-client'
import { createWagmiTestConfig } from './wagmi-config'

interface SetupHookRendererArgs<HOOK extends (args: any) => any> {
  hook: HOOK
  account?: CheckedAddress
  handlers?: RpcHandler[]
  extraHandlers?: RpcHandler[]
  args: Parameters<HOOK>[0]
  queryClient?: QueryClient
  chain?: Chain
}

export function setupHookRenderer<HOOK extends (args: any) => any>(defaultArgs: SetupHookRendererArgs<HOOK>) {
  return (
    overrides: Partial<SetupHookRendererArgs<HOOK>> = {},
  ): RenderHookResult<ReturnType<HOOK>, Parameters<HOOK>[0]> & { invalidationManager: TestInvalidationManager } => {
    const final = { ...defaultArgs, ...overrides }
    const queryClient = final.queryClient ?? defaultQueryClient
    const invalidationManager = new TestInvalidationManager(queryClient)

    const base = renderHook(final.hook, {
      initialProps: final.args,
      wrapper: ({ children }) => (
        <TestingWrapper
          config={createWagmiTestConfig({
            transport: makeMockTransport([...(final.handlers ?? []), ...(final.extraHandlers ?? [])]),
            wallet: final.account ? { address: final.account } : undefined,
            chain: final.chain,
          })}
          queryClient={queryClient}
        >
          {children}
        </TestingWrapper>
      ),
    })

    return {
      ...base,
      invalidationManager,
    }
  }
}
