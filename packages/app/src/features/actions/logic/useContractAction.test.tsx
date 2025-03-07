import { aaveContractErrors } from '@/config/aaveContractErrors'
import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolConfig } from '@/config/contracts-generated'
import { TestingWrapper } from '@/test/integration/TestingWrapper'
import { getMockMarketInfo, testAddresses, testTokens } from '@/test/integration/constants'
import { handlers, makeMockTransport } from '@/test/integration/mockTransport'
import { queryClient as defaultQueryClient } from '@/test/integration/query-client'
import { createWagmiTestConfig } from '@/test/integration/wagmi-config'
import { NormalizedUnitNumber, toBigInt } from '@marsfoundation/common-universal'
import { renderHook, waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { test } from 'vitest'
import { useContractAction } from './useContractAction'

describe(useContractAction.name, () => {
  test('translates aave errors', async () => {
    const userAddress = testAddresses.alice
    const chainId = mainnet.id
    const token = testTokens.WETH
    const amount = NormalizedUnitNumber(1)

    const wagmiConfig = createWagmiTestConfig({
      transport: makeMockTransport([
        handlers.contractCallError({
          abi: poolAbi,
          to: lendingPoolConfig.address[chainId],
          from: userAddress,
          functionName: 'withdraw',
          args: [token.address, toBigInt(token.toBaseUnit(amount)), userAddress],
          errorMessage: '57',
        }),
      ]),
      wallet: { address: userAddress },
      chain: mainnet,
    })

    const { result } = renderHook(useContractAction, {
      initialProps: {
        context: {
          account: userAddress,
          chainId,
          txReceipts: [],
          wagmiConfig,
          marketInfo: getMockMarketInfo(),
        },
        action: {
          type: 'withdraw',
          token,
          value: amount,
        },
        enabled: true,
      },
      wrapper: ({ children }) => (
        <TestingWrapper config={wagmiConfig} queryClient={defaultQueryClient}>
          {children}
        </TestingWrapper>
      ),
    })

    await waitFor(() => expect((result.current.state as any).message).toBe(aaveContractErrors['57']))
  })
})
