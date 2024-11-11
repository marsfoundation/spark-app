import { poolAbi } from '@/config/abis/poolAbi'
import { NATIVE_ASSET_MOCK_ADDRESS, LAST_UI_REFERRAL_CODE } from '@/config/consts'
import { lendingPoolAddress, wethGatewayAbi, wethGatewayAddress } from '@/config/contracts-generated'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getMockToken, testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { getTimestampInSeconds } from '@/utils/time'
import { waitFor } from '@testing-library/react'
import { generatePrivateKey } from 'viem/accounts'
import { describe, test } from 'vitest'
import { createPermitStore } from '../../../logic/permits'
import { createDepositActionConfig } from './depositAction'
import { lastSepolia } from '@/config/chain/constants'

const depositValue = NormalizedUnitNumber(1)
const depositToken = getMockToken({ symbol: TokenSymbol('TEST') })
const nativeAsset = getMockToken({ address: NATIVE_ASSET_MOCK_ADDRESS })
const account = testAddresses.alice
const chainId = lastSepolia.id
const referralCode = LAST_UI_REFERRAL_CODE

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'deposit', token: depositToken, value: depositValue }, enabled: true },
})

describe(createDepositActionConfig.name, () => {
  test('deposits native asset', async () => {
    const { result } = hookRenderer({
      args: { action: { type: 'deposit', token: nativeAsset, value: depositValue }, enabled: true },
      extraHandlers: [
        handlers.contractCall({
          to: wethGatewayAddress[lastSepolia.id],
          abi: wethGatewayAbi,
          functionName: 'depositETH',
          args: [lendingPoolAddress[lastSepolia.id], account, referralCode],
          from: account,
          result: undefined,
          value: toBigInt(nativeAsset.toBaseUnit(depositValue)),
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

  test('supplies any token', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[lastSepolia.id],
          abi: poolAbi,
          functionName: 'supply',
          args: [depositToken.address, toBigInt(depositToken.toBaseUnit(depositValue)), account, referralCode],
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

  test('supplies with permit', async () => {
    const random32Bytes = generatePrivateKey()
    const permitDeadline = new Date()
    const permitStore = createPermitStore()
    permitStore.add({
      token: depositToken,
      deadline: permitDeadline,
      signature: {
        r: random32Bytes,
        s: random32Bytes,
        v: 0n,
      },
    })

    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[lastSepolia.id],
          abi: poolAbi,
          functionName: 'supplyWithPermit',
          args: [
            depositToken.address,
            toBigInt(depositToken.toBaseUnit(depositValue)),
            account,
            referralCode,
            toBigInt(getTimestampInSeconds(permitDeadline)),
            0,
            random32Bytes,
            random32Bytes,
          ],
          from: account,
          result: undefined,
        }),
        handlers.mineTransaction(),
      ],
      args: {
        action: { type: 'deposit', token: depositToken, value: depositValue },
        context: { permitStore },
        enabled: true,
      },
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
