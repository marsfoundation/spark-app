import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class NavbarPageObject extends BasePageObject {
  // #region locators
  locateAirdropBadge(): Locator {
    return this.page.getByTestId(testIds.topbar.airdrop.badge)
  }

  locateRewardsBadge(): Locator {
    return this.page.getByTestId(testIds.topbar.rewards.badge)
  }

  locateRewardsDropdown(): Locator {
    return this.page.getByTestId(testIds.topbar.rewards.details.dropdown)
  }

  locateAirdropPreciseAmount(): Locator {
    return this.page.getByTestId(testIds.topbar.airdrop.dropdown).getByText('SPK').first()
  }

  locateSavingsLink(): Locator {
    return this.page.getByRole('link', { name: 'Savings' })
  }
  // #endregion

  // #region actions
  async openAirdropDropdown(): Promise<void> {
    await this.locateAirdropBadge().click()
  }

  async openRewardsDropdown(): Promise<void> {
    await this.locateRewardsBadge().click()
  }

  async clickClaimRewards(): Promise<void> {
    const dropdown = this.locateRewardsDropdown()

    await dropdown.getByRole('menuitem', { name: /Claim rewards/ }).click()
  }

  async openClaimRewardsDialog(): Promise<void> {
    await this.openRewardsDropdown()
    await this.clickClaimRewards()
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
    await expect(this.page.getByTestId(testIds.topbar.rewards.claimableRewards)).toHaveText(value)
  }

  async expectRewardsBadgeNotVisible(): Promise<void> {
    await expect(this.locateRewardsBadge()).not.toBeVisible()
  }

  async expectRewards(rows: Reward[]): Promise<void> {
    const dropdown = this.locateRewardsDropdown()

    for (const [index, row] of rows.entries()) {
      const rowLocator = dropdown.getByTestId(testIds.topbar.rewards.details.row(index)).first()
      await expect(rowLocator.getByTestId(testIds.topbar.rewards.details.token)).toHaveText(row.tokenSymbol)
      await expect(rowLocator.getByTestId(testIds.topbar.rewards.details.amount)).toHaveText(row.amount)
      await expect(rowLocator.getByTestId(testIds.topbar.rewards.details.amountUSD)).toHaveText(row.amountUSD)
    }
  }
  // #endregion
}

interface Reward {
  tokenSymbol: string
  amount: string
  amountUSD: string
}
