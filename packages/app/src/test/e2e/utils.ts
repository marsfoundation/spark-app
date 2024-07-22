import {
  lendingPoolAddressProviderAddress,
  uiPoolDataProviderAbi,
  uiPoolDataProviderAddress,
} from '@/config/contracts-generated'
import { BaseUnitNumber, NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { bigNumberify } from '@/utils/bigNumber'
import { Locator, Page } from '@playwright/test'
import { http, Address, createPublicClient, erc20Abi, weiUnits } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

/**
 *  Helper function to take deterministic screenshots.
 */
export async function screenshot(pageOrLocator: Page | Locator, name: string): Promise<void> {
  const page = isPage(pageOrLocator) ? pageOrLocator : pageOrLocator.page()
  const locator = isPage(pageOrLocator) ? page.locator('html') : pageOrLocator

  // note: hide entirely elements that can change in size
  const selectorsToHide = [
    `[data-testid="wallet-button"]`, // hide address because it can change
    '.toast-notifications', // hide notifications because sometimes they are fast to disappear and can't be captured deterministically
    `[data-testid="react-confetti"]`,
  ]
  // note: mask elements that can change but not in size
  const selectorsToMask: string[] = []

  // hide elements
  await page.evaluate((selectors) => {
    for (const selector of selectors) {
      const element: any = document.querySelector(selector)
      if (!element) {
        continue // skip if element not found
      }

      element.__oldDisplay = element.style.display
      element.style.display = 'none'
    }
  }, selectorsToHide)

  await locator.screenshot({
    path: `__screenshots-e2e__/${name}-${page.viewportSize()?.width}.png`,
    animations: 'disabled',
    mask: selectorsToMask.map((selector) => page.locator(selector)),
  })

  // unhide elements
  await page.evaluate((selectors) => {
    for (const selector of selectors) {
      const element: any = document.querySelector(selector)
      if (!element) {
        return
      }

      element.style.display = element.__oldDisplay
    }
  }, selectorsToHide)
}

export async function waitForButtonEnabled(page: Page, name: string): Promise<void> {
  await page.waitForFunction((name) => {
    const buttons = document.querySelectorAll('button')

    const button = Array.from(buttons).find((button) => {
      return button.textContent?.includes(name)
    })

    return button && !button.disabled
  }, name)
}

export interface GenerateAccountOptions {
  privateKey?: `0x${string}`
}
export function generateAccount(opts: GenerateAccountOptions): { address: `0x${string}`; privateKey: `0x${string}` } {
  const privateKey = opts.privateKey ?? generatePrivateKey()
  return {
    address: privateKeyToAccount(privateKey).address,
    privateKey,
  }
}

export async function getTimestampFromBlockNumber(blockNumber: bigint, forkUrl: string): Promise<number> {
  const client = createPublicClient({
    transport: http(forkUrl, {
      retryCount: 5,
    }),
  })
  const block = await client.getBlock({ blockNumber })

  return Number(block.timestamp) * 1000
}

export async function parseTable<T>(tableLocator: Locator, parseRow: (row: string[]) => T): Promise<T[]> {
  const table: T[] = []
  const rows = await tableLocator.getByRole('row').all()
  let header = true
  for (const row of rows) {
    const cells = await row.getByRole('cell').all()
    const parsedRow = []
    for (const cell of cells) {
      parsedRow.push((await cell.textContent()) ?? '')
    }
    if (header) {
      // skip header
      header = false
      continue
    }

    table.push(parseRow(parsedRow))
  }
  return table
}

export async function calculateAssetsWorth(
  forkUrl: string,
  balances: Record<string, number>,
): Promise<{ total: number; assetsWorth: Record<string, number> }> {
  const publicClient = createPublicClient({
    transport: http(forkUrl),
  })
  const chainId = await publicClient.getChainId()

  const uiPoolDataProvider = uiPoolDataProviderAddress[chainId as keyof typeof uiPoolDataProviderAddress]
  const lendingPoolAddressProvider =
    lendingPoolAddressProviderAddress[chainId as keyof typeof lendingPoolAddressProviderAddress]
  if (!uiPoolDataProvider || !lendingPoolAddressProvider) {
    throw new Error(`Couldn't find addresses for chain ${chainId}`)
  }

  const [reserves, baseCurrencyInfo] = await publicClient.readContract({
    address: uiPoolDataProvider,
    functionName: 'getReservesData',
    args: [lendingPoolAddressProvider],
    abi: uiPoolDataProviderAbi,
  })

  let total = 0
  const assetsWorth: Record<string, number> = {}
  for (const [asset, amount] of Object.entries(balances)) {
    const price = reserves.find(
      (reserve) => reserve.symbol === asset || (asset === 'ETH' && reserve.symbol === 'WETH'),
    )?.priceInMarketReferenceCurrency
    if (!price) {
      throw new Error(`Couldn't find price for ${asset}`)
    }

    total += Number(price) * amount
    assetsWorth[asset] = (Number(price) * amount) / Number(baseCurrencyInfo.marketReferenceCurrencyPriceInUsd)
  }

  return { total: total / Number(baseCurrencyInfo.marketReferenceCurrencyPriceInUsd), assetsWorth }
}

export function isPage(pageOrLocator: Page | Locator): pageOrLocator is Page {
  return 'addInitScript' in pageOrLocator
}

export interface GetBalanceArgs {
  forkUrl: string
  address: Address
}

export interface GetTokenBalanceArgs extends GetBalanceArgs {
  token: {
    address: Address
    decimals: number
  }
}

export async function getBalance({ forkUrl, address }: GetBalanceArgs): Promise<NormalizedUnitNumber> {
  const publicClient = createPublicClient({
    transport: http(forkUrl),
  })

  const balance = await publicClient.getBalance({ address })
  return NormalizedUnitNumber(bigNumberify(balance).shiftedBy(weiUnits.ether))
}

export async function getTokenBalance({ forkUrl, address, token }: GetTokenBalanceArgs): Promise<NormalizedUnitNumber> {
  const publicClient = createPublicClient({
    transport: http(forkUrl),
  })

  const balance = await publicClient.readContract({
    address: token.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const mockToken = USD_MOCK_TOKEN.clone({ decimals: token.decimals })
  return mockToken.fromBaseUnit(BaseUnitNumber(balance))
}
