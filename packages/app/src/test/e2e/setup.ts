import { Path, paths } from '@/config/paths'
import { TestnetClient, getUrlFromClient } from '@marsfoundation/common-testnets'
import { assertNever } from '@marsfoundation/common-universal'
import { Page } from '@playwright/test'
import { generatePath } from 'react-router-dom'
import { Address, Hash, parseEther, parseUnits } from 'viem'
import { AssetsInTests, TOKENS_ON_FORK } from './constants'
import {
  injectFixedDate,
  injectFlags,
  injectNetworkConfiguration,
  injectUpdatedDate,
  injectWalletConfiguration,
} from './injectSetup'
import { getTestnetContext } from './testnet-cache'
import { generateAccount } from './utils'

export type InjectableWallet = { address: Address } | { privateKey: string }

type PathParams<K extends Path> = Parameters<typeof generatePath<(typeof paths)[K]>>[1]
export function buildUrl<T extends Path>(key: T, pathParams?: PathParams<T>): string {
  return `http://localhost:4000${generatePath(paths[key], pathParams)}`
}

export type AssetBalances = Partial<Record<AssetsInTests, number>>
export type ConnectionType = 'not-connected' | 'connected-random' | 'connected-pkey' | 'connected-address'
export type AccountOptions<T extends ConnectionType> = T extends 'not-connected'
  ? {
      type: T
    }
  : T extends 'connected-random'
    ? {
        type: T
        assetBalances?: Partial<Record<AssetsInTests, number>>
      }
    : T extends 'connected-pkey'
      ? {
          type: T
          privateKey: Hash
          assetBalances?: Partial<Record<AssetsInTests, number>>
        }
      : T extends 'connected-address'
        ? {
            type: T
            address: Address
            assetBalances?: Partial<Record<AssetsInTests, number>>
          }
        : never

export interface BlockchainOptions {
  chainId: number
  blockNumber: bigint
}
export interface SetupOptions<K extends Path, T extends ConnectionType> {
  blockchain: BlockchainOptions
  initialPage: K
  initialPageParams?: PathParams<K>
  account: AccountOptions<T>
  skipInjectingNetwork?: boolean
}

export type SetupReturn<T extends ConnectionType> = (T extends 'not-connected' ? {} : { account: Address }) & {
  testnetClient: TestnetClient
  updateBrowserAndNextBlockTime: (seconds: number) => Promise<void>
  incrementTime: (seconds: number) => Promise<void>
}

// should be called at the beginning of any test
export async function setup<K extends Path, T extends ConnectionType>(
  page: Page,
  options: SetupOptions<K, T>,
): Promise<SetupReturn<T>> {
  const { client: testnetClient, initialSnapshotId } = await getTestnetContext(options.blockchain)
  await testnetClient.revert(initialSnapshotId)

  await injectPageSetup({ page, testnetClient, options })
  const address = await setupAccount({ page, testnetClient, options: options.account })
  await page.goto(buildUrl(options.initialPage, options.initialPageParams))

  async function updateBrowserAndNextBlockTime(seconds: number): Promise<void> {
    const { timestamp: currentTimestamp } = await testnetClient.getBlock()

    const progressedTimestamp = currentTimestamp + BigInt(seconds)
    await testnetClient.setNextBlockTimestamp(progressedTimestamp)
    await injectUpdatedDate(page, new Date(Number(currentTimestamp) * 1000))
  }

  async function incrementTime(seconds: number): Promise<void> {
    await updateBrowserAndNextBlockTime(seconds)
    await testnetClient.mineBlocks(1n)
    await updateBrowserAndNextBlockTime(5)
  }

  // @note: Sync time in browser with current time on blockchain,
  // set next block to be mined timestamp to be 5 seconds more.
  await updateBrowserAndNextBlockTime(5)

  return {
    account: address,
    testnetClient,
    updateBrowserAndNextBlockTime,
    incrementTime,
  } as any
}

export async function injectFunds(
  testnetClient: TestnetClient,
  address: Address,
  assetBalances?: AssetBalances,
): Promise<void> {
  if (!assetBalances) {
    return
  }

  const chainId = await testnetClient.getChainId()
  for (const [tokenName, balance] of Object.entries(assetBalances)) {
    const { timestamp } = await testnetClient.getBlock()
    await testnetClient.setNextBlockTimestamp(timestamp + 1n)
    if (tokenName === 'ETH' || tokenName === 'XDAI') {
      await testnetClient.setBalance(address, parseEther(balance.toString()))
    } else {
      await testnetClient.setErc20Balance(
        (TOKENS_ON_FORK as any)[chainId][tokenName].address,
        address,
        parseUnits(balance.toString(), (TOKENS_ON_FORK as any)[chainId][tokenName].decimals),
      )
    }
  }
}

async function setupAccount<T extends ConnectionType>({
  page,
  testnetClient,
  options,
}: {
  page: Page
  testnetClient: TestnetClient
  options: AccountOptions<T>
}): Promise<Address | undefined> {
  switch (options.type) {
    case 'connected-random': {
      const account = generateAccount({ privateKey: undefined })
      await injectWalletConfiguration(page, account)
      await injectFunds(testnetClient, account.address, options.assetBalances)
      return account.address
    }

    case 'connected-pkey': {
      const account = generateAccount({ privateKey: options.privateKey })
      await injectWalletConfiguration(page, account)
      await injectFunds(testnetClient, account.address, options.assetBalances)
      return account.address
    }

    case 'connected-address': {
      await injectWalletConfiguration(page, { address: options.address })
      return options.address
    }

    case 'not-connected':
      return undefined

    default:
      assertNever(options)
  }
}

async function injectPageSetup({
  page,
  testnetClient,
  options,
}: {
  page: Page
  testnetClient: TestnetClient
  options: SetupOptions<any, any>
}): Promise<void> {
  const blockchainTimestamp = (await testnetClient.getBlock()).timestamp

  if (options.skipInjectingNetwork === true) {
    // if explicitly disabled, do not inject network config abort all network requests to RPC providers
    await page.route(/alchemy/, (route) => route.abort())
    await page.route(/rpc.ankr/, (route) => route.abort())
  } else {
    await injectNetworkConfiguration(page, getUrlFromClient(testnetClient), options.blockchain.chainId)
  }
  await injectFixedDate(page, new Date(Number(blockchainTimestamp) * 1000))
  await injectFlags(page, testnetClient)
}
