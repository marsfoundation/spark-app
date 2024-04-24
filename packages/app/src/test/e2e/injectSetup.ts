import { Page } from '@playwright/test'

import {
  PLAYWRIGHT_WALLET_ADDRESS_KEY,
  PLAYWRIGHT_WALLET_FORK_URL_KEY,
  PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
} from '@/config/wagmi/config.e2e'

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

export async function injectNetworkConfiguration(page: Page, rpcUrl: string): Promise<void> {
  await page.addInitScript(
    ({ PLAYWRIGHT_WALLET_FORK_URL_KEY, rpcUrl }) => {
      ;(window as any)[PLAYWRIGHT_WALLET_FORK_URL_KEY] = rpcUrl
    },
    {
      PLAYWRIGHT_WALLET_FORK_URL_KEY,
      rpcUrl,
    },
  )
}

export async function injectFixedDate(page: Page, date: Date): Promise<void> {
  // setup fake Date for deterministic tests
  // https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
  const fakeNow = date.valueOf()
  await page.addInitScript(`
    {
      // Extend Date constructor to default to fakeNow
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${fakeNow});
          } else {
            super(...args);
          }
        }
      }
      // Override Date.now() to start from fakeNow
      const __DateNowOffset = ${fakeNow} - Date.now();
      const __DateNow = Date.now;
      Date.now = () => __DateNow() + __DateNowOffset;
    }`)
}
