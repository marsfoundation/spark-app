import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'
import { Locator, expect } from '@playwright/test'

export class MarketsPageObject extends BasePageObject {
  // #region locators
  locateActiveMarketsRows(): Locator {
    return this.page.getByRole('table').first().getByRole('rowgroup').last().getByRole('row')
  }

  locateFrozenMarketsTableBody(): Locator {
    return this.page.getByRole('table').last().getByRole('rowgroup').last().getByRole('row')
  }
  // #endregion

  // #region actions
  async showFrozenMarkets(): Promise<void> {
    await this.page.getByTestId(testIds.markets.frozenAssetsSwitch).click()
  }
  // #endregion

  // #region assertions
  async expectActiveMarketsTable(rows: MarketsTableRow[]): Promise<void> {
    await this.expectMarketsTable(rows, this.locateActiveMarketsRows())
  }

  async expectFrozenMarketsTable(rows: MarketsTableRow[]): Promise<void> {
    await this.expectMarketsTable(rows, this.locateFrozenMarketsTableBody())
  }

  async expectPill({
    type,
    locator,
    shouldBeVisible,
  }: { type: 'frozen' | 'paused'; locator: Locator; shouldBeVisible?: boolean }): Promise<void> {
    const pill = locator.getByTestId(type === 'frozen' ? testIds.markets.frozenPill : testIds.markets.pausedPill)
    if (shouldBeVisible) {
      await expect(pill).toBeVisible()
    }
    await expect(pill).not.toBeVisible()
  }

  async expectAssetsCell(row: Locator, asset: MarketsTableRow['asset']): Promise<void> {
    const assetLocator = row.getByTestId(testIds.markets.table.cell.asset)
    await expect(assetLocator).toContainText(asset.name)
    await expect(assetLocator).toContainText(asset.symbol)
    await this.expectPill({ type: 'frozen', locator: assetLocator, shouldBeVisible: asset.isFrozen })
    await this.expectPill({ type: 'paused', locator: assetLocator, shouldBeVisible: asset.isPaused })
  }

  async expectMarketsTable(rows: MarketsTableRow[], rowsLocator: Locator): Promise<void> {
    // await expect(tableRows).toHaveLength(rows.length)

    for (const [index, row] of rows.entries()) {
      const rowLocator = rowsLocator.nth(index)
      await this.expectAssetsCell(rowLocator, row.asset)
    }
  }
  // #endregion
}

export interface MarketsTableRow {
  asset: {
    name: string
    symbol: string
    isFrozen?: boolean
    isPaused?: boolean
  }
  totalSupplied: {
    tokenValue: string
    usdValue: string
  }
  depositAPY: {
    value: string
    hasAirDrop?: boolean
    hasReward?: boolean
  }
  totalBorrowed: {
    tokenValue: string
    usdValue: string
  }
  borrowAPY: {
    value: string
    hasAirDrop?: boolean
    hasReward?: boolean
  }
  status: {
    supply: string
    collateral: string
    borrow: string
  }
}
