import { QueryClient } from '@tanstack/react-query'
import { renderHook, RenderHookResult } from '@testing-library/react'

import { CheckedAddress } from '@/domain/types/CheckedAddress'

import { makeMockTransport } from './mockTransport'
import { RpcHandler } from './mockTransport/types'
import { TestingWrapper } from './TestingWrapper'
import { createWagmiTestConfig } from './wagmi-config'

interface SetupHookRendererArgs<HOOK extends (args: any) => any> {
  hook: HOOK
  account?: CheckedAddress
  handlers: RpcHandler[]
  extraHandlers?: RpcHandler[]
  args: Parameters<HOOK>[0]
  queryClient?: QueryClient
}

export function setupHookRenderer<HOOK extends (args: any) => any>(defaultArgs: SetupHookRendererArgs<HOOK>) {
  return (
    overrides: Partial<SetupHookRendererArgs<HOOK>> = {},
  ): RenderHookResult<ReturnType<HOOK>, Parameters<HOOK>[0]> => {
    const final = { ...defaultArgs, ...overrides }

    return renderHook(final.hook, {
      initialProps: final.args,
      wrapper: ({ children }) => (
        <TestingWrapper
          config={createWagmiTestConfig({
            transport: makeMockTransport([...final.handlers, ...(final.extraHandlers ?? [])]),
            wallet: final.account ? { address: final.account } : undefined,
          })}
          queryClient={final.queryClient}
        >
          {children}
        </TestingWrapper>
      ),
    })
  }
}
