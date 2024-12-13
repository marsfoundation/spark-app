import { Page } from '@playwright/test'

import {
  PLAYWRIGHT_CHAIN_ID,
  PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY,
  PLAYWRIGHT_WALLET_ADDRESS_KEY,
  PLAYWRIGHT_WALLET_FORK_URL_KEY,
  PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
} from '@/config/wagmi/config.e2e'

import { zeroAddress } from 'viem'
import { base, mainnet } from 'viem/chains'
import { InjectableWallet } from './setup'
import { TestnetClient } from '@marsfoundation/common-testnets'

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

export async function injectFlags(page: Page, testnetClient: TestnetClient): Promise<void> {
  const susdsDeployed = await isSudsDeployed(testnetClient)

  await page.addInitScript(
    ({ PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY, susdsDeployed }) => {
      if (!susdsDeployed) {
        ;(window as any)[PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY] = true
      }
    },
    { PLAYWRIGHT_USDS_CONTRACTS_NOT_AVAILABLE_KEY, susdsDeployed },
  )
}

// @todo: Consider deleting this after rewriting tests with vnets
async function isSudsDeployed(testnetClient: TestnetClient): Promise<boolean> {
  const chainId = await testnetClient.getChainId()

  const susdsAddress = (() => {
    if (chainId === mainnet.id) {
      return '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD'
    }

    if (chainId === base.id) {
      return '0x5875eEE11Cf8398102FdAd704C9E96607675467a'
    }

    return zeroAddress
  })()
  const susdsBytecode = await testnetClient.getCode({ address: susdsAddress })

  return susdsBytecode !== undefined && susdsBytecode.length > 2
}
