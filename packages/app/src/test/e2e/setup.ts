import { Page } from '@playwright/test'
import { generatePath } from 'react-router-dom'
import { Address, Hash, parseEther, parseUnits } from 'viem'

import { paths } from '@/config/paths'
import { BaseUnitNumber } from '@/domain/types/NumericValues'

import { tenderlyRpcActions } from '@/domain/tenderly/TenderlyRpcActions'
import { AssetsInTests, TOKENS_ON_FORK } from './constants'
import { injectFixedDate, injectNetworkConfiguration, injectWalletConfiguration } from './injectSetup'
import { ForkContext } from './setupFork'
import { generateAccount } from './utils'

export type InjectableWallet = { address: Address } | { privateKey: string }

type PathParams<K extends keyof typeof paths> = Parameters<typeof generatePath<(typeof paths)[K]>>[1]
export function buildUrl<T extends keyof typeof paths>(key: T, pathParams?: PathParams<T>): string {
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

export interface SetupOptions<K extends keyof typeof paths, T extends ConnectionType> {
  initialPage: K
  initialPageParams?: PathParams<K>
  account: AccountOptions<T>
  skipInjectingNetwork?: boolean
}

export type SetupReturn<T extends ConnectionType> = T extends 'not-connected'
  ? {
      getLogs: () => string[]
    }
  : {
      account: Address
      getLogs: () => string[]
    }

// should be called at the beginning of any test
export async function setup<K extends keyof typeof paths, T extends ConnectionType>(
  page: Page,
  forkContext: ForkContext,
  options: SetupOptions<K, T>,
): Promise<SetupReturn<T>> {
  if (options.skipInjectingNetwork === true) {
    // if explicitly disabled, do not inject network config abort all network requests to RPC providers
    await page.route(/alchemy/, (route) => route.abort())
    await page.route(/rpc.ankr/, (route) => route.abort())
  } else {
    await injectNetworkConfiguration(page, forkContext.forkUrl, forkContext.chainId)
  }
  await injectFixedDate(page, forkContext.simulationDate)
  let address: Address | undefined

  if (options.account.type !== 'not-connected') {
    if (options.account.type === 'connected-random') {
      const account = generateAccount({ privateKey: undefined })
      address = account.address
      await injectWalletConfiguration(page, account)
      await injectFunds(forkContext, account.address, options.account.assetBalances)
    }
    if (options.account.type === 'connected-pkey') {
      const account = generateAccount({ privateKey: options.account.privateKey })
      address = account.address
      await injectWalletConfiguration(page, account)
      await injectFunds(forkContext, account.address, options.account.assetBalances)
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

  return {
    account: address,
    getLogs: () => errorLogs,
  } as any
}

export async function injectFunds(
  forkContext: ForkContext,
  address: Address,
  assetBalances?: AssetBalances,
): Promise<void> {
  if (!assetBalances) {
    return
  }

  const promises = Object.entries(assetBalances).map(async ([tokenName, balance]) => {
    if (tokenName === 'ETH' || tokenName === 'XDAI') {
      await tenderlyRpcActions.setBalance(forkContext.forkUrl, address, BaseUnitNumber(parseEther(balance.toString())))
    } else {
      await tenderlyRpcActions.setTokenBalance(
        forkContext.forkUrl,
        (TOKENS_ON_FORK as any)[forkContext.chainId][tokenName].address,
        address,
        BaseUnitNumber(
          parseUnits(balance.toString(), (TOKENS_ON_FORK as any)[forkContext.chainId][tokenName].decimals),
        ),
      )
    }
  })
  await Promise.all(promises)
}
