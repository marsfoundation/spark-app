import { Page } from '@playwright/test'
import { generatePath } from 'react-router-dom'
import { Address, parseEther, parseUnits } from 'viem'

import { paths } from '@/config/paths'
import { publicTenderlyActions } from '@/domain/sandbox/publicTenderlyActions'
import { BaseUnitNumber } from '@/domain/types/NumericValues'

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

export type AccountOptions =
  | {
      type: 'not-connected'
    }
  | {
      type: 'connected-random'
      assetBalances?: AssetBalances
      privateKey?: undefined // aids type-safety
    }
  | {
      type: 'connected-pkey'
      privateKey: `0x${string}`
      assetBalances?: AssetBalances
    }
  | {
      type: 'connected-address'
      address: Address
      privateKey?: undefined
    }
export type AccountTypeKey = AccountOptions['type']

export interface SetupOptions<K extends keyof typeof paths, T extends AccountOptions> {
  initialPage: K
  initialPageParams?: PathParams<K>
  account: T
}

export type SetupReturn<T extends AccountTypeKey> = T extends 'connected-random'
  ? {
      account: Address
      getLogs: () => string[]
    }
  : {
      getLogs: () => string[]
    }

// @note: should be called at the beginning of any test
export async function setup<K extends keyof typeof paths, T extends AccountOptions>(
  page: Page,
  forkContext: ForkContext,
  options: SetupOptions<K, T>,
): Promise<SetupReturn<T['type']>> {
  await injectNetworkConfiguration(page, forkContext.forkUrl, forkContext.chainId)
  await injectFixedDate(page, forkContext.simulationDate)

  let address: Address | undefined

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

  for (const [tokenName, balance] of Object.entries(assetBalances)) {
    if (tokenName === 'ETH' || tokenName === 'XDAI') {
      await publicTenderlyActions.setBalance(
        forkContext.forkUrl,
        address,
        BaseUnitNumber(parseEther(balance.toString())),
      )
    } else {
      await publicTenderlyActions.setTokenBalance(
        forkContext.forkUrl,
        (TOKENS_ON_FORK as any)[forkContext.chainId][tokenName].address,
        address,
        BaseUnitNumber(
          parseUnits(balance.toString(), (TOKENS_ON_FORK as any)[forkContext.chainId][tokenName].decimals),
        ),
      )
    }
  }
}
