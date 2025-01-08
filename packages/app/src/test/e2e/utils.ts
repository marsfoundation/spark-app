import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { bigNumberify } from '@marsfoundation/common-universal'
import { BaseUnitNumber, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { Locator, Page } from '@playwright/test'
import { http, Address, createPublicClient, erc20Abi, weiUnits } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

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

  const tokenBalance = await publicClient.readContract({
    address: token.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const mockToken = USD_MOCK_TOKEN.clone({ decimals: token.decimals })
  return mockToken.fromBaseUnit(BaseUnitNumber(tokenBalance))
}
