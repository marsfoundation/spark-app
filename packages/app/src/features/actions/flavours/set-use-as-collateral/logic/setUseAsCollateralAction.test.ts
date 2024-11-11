import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getMockToken, testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { waitFor } from '@testing-library/react'
import { describe, test } from 'vitest'
import { createSetUseAsCollateralActionConfig } from './setUseAsCollateralAction'
import { lastSepolia } from '@/config/chain/constants'

const collateral = getMockToken({ symbol: TokenSymbol('TEST') })
const account = testAddresses.alice
const chainId = lastSepolia.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'setUseAsCollateral', token: collateral, useAsCollateral: true }, enabled: true },
})

describe(createSetUseAsCollateralActionConfig.name, () => {
  test('enables asset as collateral', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[chainId],
          abi: poolAbi,
          functionName: 'setUserUseReserveAsCollateral',
          args: [collateral.address, true],
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
  })

  test('disables asset as collateral', async () => {
    const { result } = hookRenderer({
      args: { action: { type: 'setUseAsCollateral', token: collateral, useAsCollateral: false }, enabled: true },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[chainId],
          abi: poolAbi,
          functionName: 'setUserUseReserveAsCollateral',
          args: [collateral.address, false],
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
  })
})
