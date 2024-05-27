import { expect } from '@playwright/test'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { BasePageObject } from '@/test/e2e/BasePageObject'
import { buildUrl } from '@/test/e2e/setup'
import { parseTable } from '@/test/e2e/utils'
import { testIds } from '@/ui/utils/testIds'

export class DashboardPageObject extends BasePageObject {
  // #region actions
  async clickDepositButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Deposit')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await row.getByRole('button', { name: 'Deposit' }).click()
  }

  async clickWithdrawButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Deposit')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await row.getByRole('button', { name: 'Withdraw' }).click()
  }

  async clickCollateralSwitchAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Deposit')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await row.getByRole('switch').click()
  }

  async clickBorrowButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Borrow')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await row.getByRole('button', { name: 'Borrow' }).click()
  }

  async clickRepayButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Borrow')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await row.getByRole('button', { name: 'Repay' }).click()
  }

  async parseDepositTable(): Promise<DepositTableRow[]> {
    const table = this.locatePanelByHeader('Deposit')
    return parseTable(table, (row) => {
      return depositTableRowSchema.parse({
        asset: row[0],
        inWallet: row[1]?.trim().split(/[ $]/)[0],
        deposit: row[2]?.trim().split(/[ $]/)[0],
      })
    })
  }

  async parseBorrowTable(): Promise<BorrowTableRow[]> {
    const table = this.locatePanelByHeader('Borrow')
    return parseTable(table, (row) => {
      return borrowTableRowSchema.parse({
        asset: row[0],
        available: row[1]?.trim().split(/[ $]/)[0],
        yourBorrow: row[2]?.trim().split(/[ $]/)[0],
      })
    })
  }

  async parseWalletTable(): Promise<WalletTableRow[]> {
    const table = this.locatePanelByHeader('Your wallet')
    return parseTable(table, (row) => {
      return walletTableRowSchema.parse({
        asset: row[0],
        amount: row[1]?.trim().split(/[ $]/)[0],
      })
    })
  }

  async goToDashboardAction(): Promise<void> {
    await this.page.goto(buildUrl('dashboard'))
  }
  // #endregion

  // #region assertions
  async expectPositionToBeEmpty(): Promise<void> {
    const deposit = this.page.getByTestId(testIds.dashboard.deposited)
    const borrow = this.page.getByTestId(testIds.dashboard.borrowed)
    await expect(deposit).toHaveText('-')
    await expect(borrow).toHaveText('-')
  }

  async expectBorrowedAssetsToBeEmpty(): Promise<void> {
    const borrow = this.page.getByTestId(testIds.dashboard.borrowed)
    await expect(borrow).toHaveText('-')
  }

  async expectHealthFactor(hf: string): Promise<void> {
    const locator = this.page.getByTestId(testIds.component.HealthFactorBadge.value)
    await expect(locator).toHaveText(hf)
  }

  async expectDepositedAssets(total: number): Promise<void> {
    const locator = this.page.getByTestId(testIds.dashboard.deposited)
    await expect(locator).toHaveText(USD_MOCK_TOKEN.formatUSD(NormalizedUnitNumber(total), { compact: true }))
  }

  async expectBorrowedAssets(total: number): Promise<void> {
    const locator = this.page.getByTestId(testIds.dashboard.borrowed)
    await expect(locator).toHaveText(USD_MOCK_TOKEN.formatUSD(NormalizedUnitNumber(total), { compact: true }))
  }

  async expectGuestScreen(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'This page is available ony for connected users', exact: true }),
    ).toBeVisible()
    await expect(this.page.getByRole('button', { name: 'Connect wallet', exact: true })).toBeVisible()
  }

  async expectDepositTable(assets: Record<string, number>): Promise<void> {
    await expect(async () => {
      const depositTable = await this.parseDepositTable()

      for (const [asset, expectedAmount] of Object.entries(assets)) {
        const row = depositTable.find((row) => row.asset === asset)
        expect(row, `Couldn't find asset ${asset}`).toBeDefined()
        invariant(row)
        expect(expectedAmount, `Couldn't find asset ${row.asset}`).toBeDefined()
        expect(row.deposit).toBe(expectedAmount)
      }

      return true
    }).toPass()
  }

  async expectCollateralSwitch(asset: string, checked: boolean): Promise<void> {
    const panel = this.locatePanelByHeader('Deposit')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: asset, exact: true }) })
    const switchLocator = row.getByRole('switch')
    await expect(switchLocator).toHaveAttribute('aria-checked', checked ? 'true' : 'false')
  }

  async expectBorrowTable(assets: Record<string, number>): Promise<void> {
    await expect(async () => {
      const borrowTable = await this.parseBorrowTable()

      for (const [asset, expectedAmount] of Object.entries(assets)) {
        const row = borrowTable.find((row) => row.asset === asset)
        expect(row, `Couldn't find asset ${asset}`).toBeDefined()
        invariant(row)
        expect(expectedAmount, `Couldn't find asset ${row.asset}`).toBeDefined()
        expect(row.yourBorrow).toBe(expectedAmount)
      }

      return true
    }).toPass()
  }

  async expectWalletTable(assets: Record<string, number>): Promise<void> {
    await expect
      .poll(async () => {
        const walletTable = await this.parseWalletTable()
        for (const [asset, expectedAmount] of Object.entries(assets)) {
          const row = walletTable.find((row) => row.asset === asset)
          // skip ETH for now as it's not supported in deposit table
          if (asset === 'ETH') {
            continue
          }
          invariant(row)
          expect(expectedAmount, `Couldn't find asset ${row.asset}`).toBeDefined()
          expect(row.amount).toBe(expectedAmount)
        }

        return true
      })
      .toBe(true)
  }

  async expectAssetToBeInDepositTable(asset: string): Promise<void> {
    const table = this.locatePanelByHeader('Deposit')
    await expect(
      // @note For some reason you can't do table.getByRole('cell', ...)
      table
        .getByRole('row')
        .filter({ has: this.page.getByRole('cell', { name: asset, exact: true }) }),
    ).toBeVisible()
  }

  async expectAssetToBeInBorrowTable(asset: string): Promise<void> {
    const table = this.locatePanelByHeader('Borrow')
    await expect(
      // @note For some reason you can't do table.getByRole('cell', ...)
      table
        .getByRole('row')
        .filter({ has: this.page.getByRole('cell', { name: asset, exact: true }) }),
    ).toBeVisible()
  }

  async expectNonZeroAmountInBorrowTable(asset: string): Promise<void> {
    const table = this.locatePanelByHeader('Borrow')
    const row = table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: asset, exact: true }) })
    const amount = row.getByRole('cell').nth(2)
    await expect(amount).not.toHaveText('—')
  }
  // #endregion
}

const numberOrDash = z.string().pipe(
  z.preprocess((z: unknown): string => {
    if (z === '—') {
      return '0'
    }
    return (z as string).replace(/[\,]/g, '')
  }, z.coerce.number()),
)

const depositTableRowSchema = z.object({
  asset: z.string(),
  inWallet: numberOrDash,
  deposit: numberOrDash,
})
export type DepositTableRow = z.infer<typeof depositTableRowSchema>

const borrowTableRowSchema = z.object({
  asset: z.string(),
  available: numberOrDash,
  yourBorrow: numberOrDash,
})
export type BorrowTableRow = z.infer<typeof borrowTableRowSchema>

const walletTableRowSchema = z.object({
  asset: z.string(),
  amount: numberOrDash,
})
export type WalletTableRow = z.infer<typeof walletTableRowSchema>
