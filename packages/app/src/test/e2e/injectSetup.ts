import { Page } from '@playwright/test'

import {
  PLAYWRIGHT_CHAIN_ID,
  PLAYWRIGHT_SUSDC_CONTRACTS_AVAILABLE_KEY,
  PLAYWRIGHT_WALLET_ADDRESS_KEY,
  PLAYWRIGHT_WALLET_ATOMIC_BATCH_SUPPORTED_KEY,
  PLAYWRIGHT_WALLET_FORK_URL_KEY,
  PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
} from '@/config/wagmi/e2e-consts'
import { TestnetClient } from '@marsfoundation/common-testnets'
import { zeroAddress } from 'viem'
import { base, mainnet } from 'viem/chains'
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

export async function injectFlags(page: Page, testnetClient: TestnetClient, chainId: number): Promise<void> {
  const isSusdcDeployed = await isSudcDeployed(testnetClient, chainId)

  await page.addInitScript(
    ({ PLAYWRIGHT_SUSDC_CONTRACTS_AVAILABLE_KEY, isSusdcDeployed }) => {
      if (isSusdcDeployed) {
        ;(window as any)[PLAYWRIGHT_SUSDC_CONTRACTS_AVAILABLE_KEY] = true
      }
    },
    { PLAYWRIGHT_SUSDC_CONTRACTS_AVAILABLE_KEY, isSusdcDeployed },
  )
}

async function isSudcDeployed(testnetClient: TestnetClient, chainId: number): Promise<boolean> {
  const susdcAddress = (() => {
    if (chainId === mainnet.id) {
      return '0x29bd15f2c80f2807c29d2428aa835f2be1098a62'
    }
    if (chainId === base.id) {
      return '0x62da45546a0f87b23941ffe5ca22f9d2a8fa7df3'
    }
    return zeroAddress
  })()

  const susdcBytecode = await testnetClient.getCode({ address: susdcAddress })
  return susdcBytecode !== undefined && susdcBytecode.length > 2
}
