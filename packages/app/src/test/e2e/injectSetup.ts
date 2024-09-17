import { Page } from '@playwright/test'

import {
  PLAYWRIGHT_CHAIN_ID,
  PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY,
  PLAYWRIGHT_WALLET_ADDRESS_KEY,
  PLAYWRIGHT_WALLET_FORK_URL_KEY,
  PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
} from '@/config/wagmi/config.e2e'

import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { http, createPublicClient, zeroAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { ForkContext } from './forking/setupFork'
import { InjectableWallet } from './setup'

export async function injectWalletConfiguration(page: Page, wallet: InjectableWallet): Promise<void> {
  await page.addInitScript(
    ({ PLAYWRIGHT_WALLET_ADDRESS_KEY, PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY, wallet }) => {
      if ('privateKey' in wallet) {
        delete (window as any)[PLAYWRIGHT_WALLET_ADDRESS_KEY]
        ;(window as any)[PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY] = wallet.privateKey
      } else {
        delete (window as any)[PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY]
        ;(window as any)[PLAYWRIGHT_WALLET_ADDRESS_KEY] = wallet.address
      }
    },
    {
      PLAYWRIGHT_WALLET_ADDRESS_KEY,
      PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
      PLAYWRIGHT_WALLET_FORK_URL_KEY,
      wallet,
    },
  )
}

export async function injectNetworkConfiguration(page: Page, rpcUrl: string, chainId: number): Promise<void> {
  await page.addInitScript(
    ({ PLAYWRIGHT_WALLET_FORK_URL_KEY, PLAYWRIGHT_CHAIN_ID, rpcUrl, chainId }) => {
      ;(window as any)[PLAYWRIGHT_WALLET_FORK_URL_KEY] = rpcUrl
      ;(window as any)[PLAYWRIGHT_CHAIN_ID] = chainId
    },
    {
      PLAYWRIGHT_WALLET_FORK_URL_KEY,
      PLAYWRIGHT_CHAIN_ID,
      rpcUrl,
      chainId,
    },
  )
}

export async function injectFixedDate(page: Page, date: Date): Promise<void> {
  // setup fake Date for deterministic tests
  // https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
  const fakeNow = date.valueOf()
  await page.addInitScript(overrideDateClass, fakeNow)
}

// the only difference between this and injectFixedDate is the use of page.evaluate instead of page.addInitScript
export async function injectUpdatedDate(page: Page, date: Date): Promise<void> {
  // setup fake Date for deterministic tests
  // https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
  const fakeNow = date.valueOf()
  await page.evaluate(overrideDateClass, fakeNow)
}

function overrideDateClass(fakeNow: number): void {
  // biome-ignore lint/suspicious/noGlobalAssign: <explanation>
  // @ts-ignore
  Date = class extends Date {
    // @ts-ignore
    constructor(...args) {
      if (args.length === 0) {
        super(fakeNow)
      } else {
        // @ts-ignore
        super(...args)
      }
    }
  }
  // Override Date.now() to start from fakeNow
  const __DateNowOffset = fakeNow - Date.now()
  const __DateNow = Date.now
  Date.now = () => __DateNow() + __DateNowOffset

  // @todo: When we are able to set timestamps for transactions, make tests that use vnets use line below instead of the overriding Date.now with offset
  // Date.now = () => fakeNow
}

export async function injectFlags(page: Page, forkContext: ForkContext): Promise<void> {
  const susdsAddress = (() => {
    if (forkContext.chainId === mainnet.id) {
      return '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD'
    }

    if (forkContext.chainId === USDS_DEV_CHAIN_ID) {
      return '0xCd9BC6cE45194398d12e27e1333D5e1d783104dD'
    }

    return zeroAddress
  })()
  const publicClient = createPublicClient({
    transport: http(forkContext.forkUrl),
  })
  const susdsBytecode = await publicClient.getBytecode({ address: susdsAddress })

  await page.addInitScript(
    ({ PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY, susdsBytecode }) => {
      if (susdsBytecode === undefined || susdsBytecode.length <= 2) {
        ;(window as any)[PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY] = true
      }
    },
    { PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY, susdsBytecode },
  )
}
