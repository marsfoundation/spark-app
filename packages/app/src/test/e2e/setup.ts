import { Page } from '@playwright/test'
import { generatePath } from 'react-router-dom'
import { Address, Hash, parseEther, parseUnits } from 'viem'

import { Path, paths } from '@/config/paths'

import { AssetsInTests, TOKENS_ON_FORK } from './constants'
import { injectFixedDate, injectFlags, injectNetworkConfiguration, injectUpdatedDate, injectWalletConfiguration } from './injectSetup'
import { generateAccount } from './utils'
import { getUrlFromClient, TestnetClient } from '@marsfoundation/common-testnets'
import { getTestnetContext } from './testnet-cache'

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

export type SetupReturn<T extends ConnectionType> = (T extends 'not-connected'
  ? {} : { account: Address }) & { getLogs: () => string[], progressSimulation: () => Promise<void> }

// should be called at the beginning of any test
export async function setup<K extends Path, T extends ConnectionType>(
  page: Page,
  options: SetupOptions<K, T>,
): Promise<SetupReturn<T>> {
  const { client, initialSnapshotId } = await getTestnetContext(options.blockchain)
  await client.revert(initialSnapshotId)
  const blockchainTimestamp = (await client.getBlock()).timestamp

  if (options.skipInjectingNetwork === true) {
    // if explicitly disabled, do not inject network config abort all network requests to RPC providers
    await page.route(/alchemy/, (route) => route.abort())
    await page.route(/rpc.ankr/, (route) => route.abort())
  } else {
    await injectNetworkConfiguration(page, getUrlFromClient(client), options.blockchain.chainId)
  }
  await injectFixedDate(page, new Date(Number(blockchainTimestamp) * 1000))
  await injectFlags(page, client)
  let address: Address | undefined

  if (options.account.type !== 'not-connected') {
    if (options.account.type === 'connected-random') {
      const account = generateAccount({ privateKey: undefined })
      address = account.address
      await injectWalletConfiguration(page, account)
      await injectFunds(client, account.address, options.account.assetBalances)
    }
    if (options.account.type === 'connected-pkey') {
      const account = generateAccount({ privateKey: options.account.privateKey })
      address = account.address
      await injectWalletConfiguration(page, account)
      await injectFunds(client, account.address, options.account.assetBalances)
    }
    if (options.account.type === 'connected-address') {
      address = options.account.address
      await injectWalletConfiguration(page, { address })
    }
  }

  const errorLogs = [] as string[]

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errorLogs.push(message.text())
    }
  })

  await page.goto(buildUrl(options.initialPage, options.initialPageParams))

  async function progressSimulation(seconds: number): Promise<void> {
    const currentTimestamp = (await client.getBlock()).timestamp
    const progressedTimestamp = currentTimestamp + BigInt(seconds)
    await client.setNextBlockTimestamp(progressedTimestamp)
    await client.mineBlocks(1n)
    await injectUpdatedDate(page, new Date(Number(progressedTimestamp) * 1000))
  }

  return {
    account: address,
    getLogs: () => errorLogs,
    progressSimulation,
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

  const promises = Object.entries(assetBalances).map(async ([tokenName, balance]) => {
    if (tokenName === 'ETH' || tokenName === 'XDAI') {
      await testnetClient.setBalance(address, parseEther(balance.toString()))
    } else {
      await testnetClient.setErc20Balance(
        (TOKENS_ON_FORK as any)[chainId][tokenName].address,
        address,
        parseUnits(balance.toString(), (TOKENS_ON_FORK as any)[chainId][tokenName].decimals),
      )
    }
  })
  await Promise.all(promises)
}
