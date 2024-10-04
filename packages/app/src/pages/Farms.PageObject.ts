import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'
import { Locator, expect } from '@playwright/test'

export class FarmsPageObject extends BasePageObject {
  // #region locators
  // #endregion

  // #region actionstByTestId(testIds.markets.frozenAssetsSwitch).click()
  // #endregion

  // #region assertionss
  async expectActiveFarms(rows: Farm[]): Promise<void> {
    for (const [index, row] of rows.entries()) {
      const rowLocator = this.page.getByTestId(testIds.farms.active.tile(index))
      await expect(rowLocator).toBeVisible()
      if (row.apy) {
        await this.expectAPY(rowLocator, row.apy)
      }
      await this.expectStaked(rowLocator, row.staked)
      await this.expectRewardText(rowLocator, row.rewardText)
      await this.expectStakeText(rowLocator, row.stakeText)
    }
  }

  async expectInactiveFarms(rows: Farm[]): Promise<void> {
    for (const [index, row] of rows.entries()) {
      const rowLocator = this.page.getByTestId(testIds.farms.inactive.tile(index))
      await expect(rowLocator).toBeVisible()
      if (row.apy) {
        await this.expectAPY(rowLocator, row.apy)
      }
      await this.expectStaked(rowLocator, row.staked)
      await this.expectRewardText(rowLocator, row.rewardText)
      await this.expectStakeText(rowLocator, row.stakeText)
    }
  }

  async expectAPY(rowLocator: Locator, apy: string): Promise<void> {
    await expect(rowLocator.getByTestId(testIds.farms.tile.apy)).toHaveText(apy)
  }

  async expectStaked(rowLocator: Locator, staked: string): Promise<void> {
    if (staked === '0') {
      await expect(rowLocator.getByTestId(testIds.farms.tile.staked)).toBeHidden()
    } else {
      await expect(rowLocator.getByTestId(testIds.farms.tile.staked)).toHaveText(staked)
    }
  }

  async expectRewardText(rowLocator: Locator, rewardText: string): Promise<void> {
    await expect(rowLocator.getByTestId(testIds.farms.tile.rewardText)).toHaveText(rewardText)
  }

  async expectStakeText(rowLocator: Locator, stakeText: string): Promise<void> {
    await expect(rowLocator.getByTestId(testIds.farms.tile.stakeText)).toHaveText(stakeText)
  }

  async expectActiveFarmsListToBeEmpty(): Promise<void> {
    await expect(this.page.getByTestId(testIds.farms.active.tile(0))).toBeHidden()
  }

  async expectInactiveFarmsListToBeEmpty(): Promise<void> {
    await expect(this.page.getByTestId(testIds.farms.inactive.tile(0))).toBeHidden()
  }
  // #endregion
}

interface Farm {
  apy?: string
  staked: string
  rewardText: string
  stakeText: string
}
