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
  async expectMarketsTable(rows: MarketsTableRow[], rowsLocator: Locator): Promise<void> {
    // await expect(tableRows).toHaveLength(rows.length)

    for (const [index, row] of rows.entries()) {
      const rowLocator = rowsLocator.nth(index)

      await this.expectAssetsCell(rowLocator, row.asset)
      await this.expectCompactValueCell({ type: 'totalSupplied', rowLocator, values: row.totalSupplied })
      await this.expectApyCell({ type: 'depositAPY', rowLocator, apy: row.depositAPY })
      await this.expectCompactValueCell({ type: 'totalBorrowed', rowLocator, values: row.totalBorrowed })
      await this.expectApyCell({ type: 'borrowAPY', rowLocator, apy: row.borrowAPY })
      await this.expectStatusCell(rowLocator, row.status)
    }
  }

  async expectAssetsCell(row: Locator, asset: MarketsTableRow['asset']): Promise<void> {
    const assetLocator = row.getByTestId(testIds.markets.table.cell.asset)
    await expect(assetLocator).toContainText(asset.name)
    await expect(assetLocator).toContainText(asset.symbol)
    await this.expectPill({ type: 'frozen', locator: assetLocator, shouldBeVisible: asset.isFrozen })
    await this.expectPill({ type: 'paused', locator: assetLocator, shouldBeVisible: asset.isPaused })
  }

  async expectCompactValueCell({
    rowLocator,
    values,
    type,
  }: {
    rowLocator: Locator
    values: TokenAmountWithUSDValue
    type: 'totalSupplied' | 'totalBorrowed'
  }): Promise<void> {
    const tokenAmountWithUSDValueLocator = rowLocator.getByTestId(testIds.markets.table.cell[type])
    await expect(tokenAmountWithUSDValueLocator).toContainText(values.tokenAmount)
    await expect(tokenAmountWithUSDValueLocator).toContainText(values.usdValue)
  }

  async expectApyCell({
    rowLocator,
    apy,
    type,
  }: { rowLocator: Locator; apy: APYWithRewards; type: 'depositAPY' | 'borrowAPY' }): Promise<void> {
    const apyLocator = rowLocator.getByTestId(testIds.markets.table.cell[type])
    await expect(apyLocator).toContainText(apy.value)
    await this.expectPill({ type: 'airdrop', locator: apyLocator, shouldBeVisible: apy.hasAirDrop })
    await this.expectPill({ type: 'reward', locator: apyLocator, shouldBeVisible: apy.hasReward })
  }

  async expectPill({
    type,
    locator,
    shouldBeVisible,
  }: { type: PillType; locator: Locator; shouldBeVisible?: boolean }): Promise<void> {
    const pill = locator.getByTestId(pillTypeToTestId[type])
    if (shouldBeVisible) {
      await expect(pill).toBeVisible()
    } else {
      await expect(pill).not.toBeVisible()
    }
  }

  async expectStatusCell(row: Locator, status: MarketsTableRow['status']): Promise<void> {
    const statusTriggerLocator = row.getByTestId(testIds.markets.table.cell.status)
    await statusTriggerLocator.hover()
    const tooltipLocator = this.page.getByRole('tooltip')
    await expect(tooltipLocator).toContainText(status.supply)
    await expect(tooltipLocator).toContainText(status.collateral)
    await expect(tooltipLocator).toContainText(status.borrow)
  }

  // #endregion
}

interface TokenAmountWithUSDValue {
  tokenAmount: string
  usdValue: string
}

interface APYWithRewards {
  value: string
  hasAirDrop?: boolean
  hasReward?: boolean
}

export interface MarketsTableRow {
  asset: {
    name: string
    symbol: string
    isFrozen?: boolean
    isPaused?: boolean
  }
  totalSupplied: TokenAmountWithUSDValue
  depositAPY: APYWithRewards
  totalBorrowed: TokenAmountWithUSDValue
  borrowAPY: APYWithRewards
  status: {
    supply: string
    collateral: string
    borrow: string
  }
}

type PillType = 'frozen' | 'paused' | 'airdrop' | 'reward'

const pillTypeToTestId: Record<PillType, string> = {
  frozen: testIds.markets.frozenPill,
  paused: testIds.markets.pausedPill,
  airdrop: testIds.markets.airdropBadge,
  reward: testIds.markets.rewardBadge,
} as const
