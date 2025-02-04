import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { BaseUnitNumber, CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { waitFor } from '@testing-library/react'
import { erc20Abi, erc4626Abi, parseEther, zeroAddress } from 'viem'
import { gnosis, mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { useTokensInfo } from './useTokensInfo'

const token = testAddresses.token
const alice = testAddresses.alice

const chainIdCall = handlers.chainIdCall({ chainId: mainnet.id })

const hookRenderer = setupHookRenderer({
  hook: useTokensInfo,
  account: undefined,
  handlers: [chainIdCall],
  args: {
    tokens: [
      {
        address: token,
        oracleType: 'vault',
      },
    ],
  },
})

describe(useTokensInfo.name, () => {
  test('fetches data for ERC20 token with vault oracle', async () => {
    const balance = 543217812381398n
    const decimals = 18
    const symbol = 'sDAI'
    const name = 'Savings DAI'
    const price = 1090000000000000000n

    const { result } = hookRenderer({
      account: alice,
      handlers: [
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [alice],
          result: balance,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'decimals',
          result: decimals,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'symbol',
          result: symbol,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'name',
          result: name,
        }),
        handlers.contractCall({
          to: token,
          abi: erc4626Abi,
          functionName: 'convertToAssets',
          args: [parseEther('1')],
          result: price,
        }),
      ],
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.tokensInfo.all()).toEqual([
      {
        token: {
          name,
          decimals,
          address: token,
          symbol,
          unitPriceUsd: NormalizedUnitNumber(BaseUnitNumber(price).shiftedBy(-decimals)),
          isAToken: false,
        },
        balance: NormalizedUnitNumber(BaseUnitNumber(balance).shiftedBy(-decimals)),
      },
    ])
  })

  test('fetches data for ERC20 token with fixed-usd oracle', async () => {
    const balance = 2342734243213n
    const decimals = 18
    const symbol = 'DAI'
    const name = 'DAI'

    const { result } = hookRenderer({
      account: alice,
      handlers: [
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [alice],
          result: balance,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'decimals',
          result: decimals,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'symbol',
          result: symbol,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'name',
          result: name,
        }),
      ],
      args: {
        tokens: [
          {
            address: token,
            oracleType: 'fixed-usd',
          },
        ],
      },
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.tokensInfo.all()).toEqual([
      {
        token: {
          name,
          decimals,
          address: token,
          symbol,
          unitPriceUsd: NormalizedUnitNumber(1),
          isAToken: false,
        },
        balance: NormalizedUnitNumber(BaseUnitNumber(balance).shiftedBy(-decimals)),
      },
    ])
  })

  test('fetches data for ERC20 token when user is not connected', async () => {
    const balance = 2342734243213n
    const decimals = 18
    const symbol = 'DAI'
    const name = 'DAI'

    const { result } = hookRenderer({
      handlers: [
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [alice],
          result: balance,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [zeroAddress],
          result: balance,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'decimals',
          result: decimals,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'symbol',
          result: symbol,
        }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'name',
          result: name,
        }),
      ],
      args: {
        tokens: [
          {
            address: token,
            oracleType: 'fixed-usd',
          },
        ],
      },
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.tokensInfo.all()).toEqual([
      {
        token: {
          name,
          decimals,
          address: token,
          symbol,
          unitPriceUsd: NormalizedUnitNumber(1),
          isAToken: false,
        },
        balance: NormalizedUnitNumber(0),
      },
    ])
  })

  test('fetches data for native asset with fixed-usd oracle', async () => {
    const balance = 12322429456834n
    const decimals = 18
    const symbol = 'XDAI'
    const name = 'XDAI'

    const { result } = hookRenderer({
      account: alice,
      handlers: [
        handlers.balanceCall({
          address: alice,
          balance,
        }),
        handlers.chainIdCall({
          chainId: gnosis.id,
        }),
      ],
      chain: gnosis,
      args: {
        tokens: [
          {
            address: CheckedAddress.EEEE(),
            oracleType: 'fixed-usd',
          },
        ],
      },
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.tokensInfo.all()).toEqual([
      {
        token: {
          name,
          decimals,
          address: CheckedAddress.EEEE(),
          symbol,
          unitPriceUsd: NormalizedUnitNumber(1),
          isAToken: false,
        },
        balance: NormalizedUnitNumber(BaseUnitNumber(balance).shiftedBy(-decimals)),
      },
    ])
  })

  test('fetches data for native asset when user is not connected', async () => {
    const balance = 12322429456834n
    const decimals = 18
    const symbol = 'XDAI'
    const name = 'XDAI'

    const { result } = hookRenderer({
      handlers: [
        handlers.balanceCall({
          address: alice,
          balance,
        }),
        handlers.balanceCall({
          address: zeroAddress,
          balance,
        }),
        handlers.chainIdCall({
          chainId: gnosis.id,
        }),
      ],
      chain: gnosis,
      args: {
        tokens: [
          {
            address: CheckedAddress.EEEE(),
            oracleType: 'fixed-usd',
          },
        ],
      },
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.tokensInfo.all()).toEqual([
      {
        token: {
          name,
          decimals,
          address: CheckedAddress.EEEE(),
          symbol,
          unitPriceUsd: NormalizedUnitNumber(1),
          isAToken: false,
        },
        balance: NormalizedUnitNumber(0),
      },
    ])
  })
})
