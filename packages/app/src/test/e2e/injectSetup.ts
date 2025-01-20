import { Page } from '@playwright/test'

import {
  PLAYWRIGHT_CHAIN_ID,
  PLAYWRIGHT_WALLET_ADDRESS_KEY,
  PLAYWRIGHT_WALLET_ATOMIC_BATCH_SUPPORTED_KEY,
  PLAYWRIGHT_WALLET_FORK_URL_KEY,
  PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
} from '@/config/wagmi/e2e-consts'
import { InjectableWallet } from './setup'

export async function injectWalletConfiguration(
  page: Page,
  wallet: InjectableWallet,
  atomicBatchSupported = false,
): Promise<void> {
  await page.addInitScript(
    ({
      PLAYWRIGHT_WALLET_ADDRESS_KEY,
      PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
      PLAYWRIGHT_WALLET_ATOMIC_BATCH_SUPPORTED_KEY,
      atomicBatchSupported,
      wallet,
    }) => {
      if ('privateKey' in wallet) {
        delete (window as any)[PLAYWRIGHT_WALLET_ADDRESS_KEY]
        ;(window as any)[PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY] = wallet.privateKey
      } else {
        delete (window as any)[PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY]
        ;(window as any)[PLAYWRIGHT_WALLET_ADDRESS_KEY] = wallet.address
      }

      if (atomicBatchSupported) {
        ;(window as any)[PLAYWRIGHT_WALLET_ATOMIC_BATCH_SUPPORTED_KEY] = true
      } else {
        delete (window as any)[PLAYWRIGHT_WALLET_ATOMIC_BATCH_SUPPORTED_KEY]
      }
    },
    {
      PLAYWRIGHT_WALLET_ADDRESS_KEY,
      PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
      PLAYWRIGHT_WALLET_FORK_URL_KEY,
      PLAYWRIGHT_WALLET_ATOMIC_BATCH_SUPPORTED_KEY,
      atomicBatchSupported,
      wallet,
    },
  )
}

interface InjectNetworkConfigurationParams {
  page: Page
  rpcUrl: string
  chainId: number
}

export async function injectNetworkConfiguration({
  page,
  rpcUrl,
  chainId,
}: InjectNetworkConfigurationParams): Promise<void> {
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
