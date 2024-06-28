import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class NavbarPageObject extends BasePageObject {
  // #region locators
  locateAirdropBadge(): Locator {
    return this.page.getByTestId(testIds.navbar.airdropBadge)
  }

  locateRewardsBadge(): Locator {
    return this.page.getByTestId(testIds.navbar.rewards.badge)
  }

  locateRewardsDetails(): Locator {
    return this.page.getByTestId(testIds.navbar.rewards.details.tooltip)
  }

  locateAirdropPreciseAmount(): Locator {
    return this.page.getByRole('tooltip').getByText('SPK').first()
  }

  locateSavingsLink(): Locator {
    return this.page.getByRole('link', { name: 'Cash & Savings' })
  }
  // #endregion

  // #region actions
  async hoverOverAirdropBadge(): Promise<void> {
    await this.locateAirdropBadge().hover()
  }

  async clickClaimRewards(tooltip: Locator): Promise<void> {
    await tooltip.getByRole('button', { name: 'Claim rewards' }).first().click()
  }

  async openClaimRewardsDialog(): Promise<void> {
    const rewardsDetails = this.locateRewardsDetails()
    await this.locateRewardsBadge().hover()
    await this.clickClaimRewards(rewardsDetails)
  }
  // #endregion

  // #region assertions
  async expectAirdropCompactValue(value: string): Promise<void> {
    await expect(this.locateAirdropBadge()).toHaveText(value)
  }

  async expectAirdropPreciseValue(value: string): Promise<void> {
    await expect(this.locateAirdropPreciseAmount()).toHaveText(new RegExp(`^${value}*`))
  }

  async expectAirdropBadgeNotVisible(): Promise<void> {
    await expect(this.locateAirdropBadge()).not.toBeVisible()
  }

  async expectSavingsLinkVisible(): Promise<void> {
    await expect(this.locateSavingsLink()).toBeVisible()
  }

  async expectClaimableRewardsValue(value: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.navbar.rewards.claimableRewards)).toHaveText(value)
  }

  async expectRewardsBadgeNotVisible(): Promise<void> {
    await expect(this.locateRewardsBadge()).not.toBeVisible()
  }

  async expectRewards(rows: Reward[], tooltip: Locator): Promise<void> {
    for (const [index, row] of rows.entries()) {
      const rowLocator = tooltip.getByTestId(testIds.navbar.rewards.details.row(index)).first()
      await expect(rowLocator.getByTestId(testIds.navbar.rewards.details.token)).toHaveText(row.tokenSymbol)
      await expect(rowLocator.getByTestId(testIds.navbar.rewards.details.amount)).toHaveText(row.amount)
      await expect(rowLocator.getByTestId(testIds.navbar.rewards.details.amountUSD)).toHaveText(row.amountUSD)
    }
  }
  // #endregion
}

interface Reward {
  tokenSymbol: string
  amount: string
  amountUSD: string
}
