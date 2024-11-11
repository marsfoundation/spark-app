import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { waitFor } from '@testing-library/react'
import { describe, test } from 'vitest'
import { createSetUserEModeActionConfig } from './setUserEModeAction'
import { lastSepolia } from '@/config/chain/constants'

const account = testAddresses.alice
const chainId = lastSepolia.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'setUserEMode', eModeCategoryId: 1 }, enabled: true },
})

describe(createSetUserEModeActionConfig.name, () => {
  test('changes e-mode category', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[chainId],
          abi: poolAbi,
          functionName: 'setUserEMode',
          args: [1],
          from: account,
          result: undefined,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(aaveDataLayerQueryKey({ chainId, account }))
  })
})
