import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class SparkRewardsPageObject extends BasePageObject {
  // #region locators
  locateClaimableRewardsRow(index: number): Locator {
    return this.locatePanelByHeader('Claimable rewards').getByTestId(testIds.component.DataTable.row(index))
  }
  // #endregion

  // #region actions
  async clickClaimButton(index: number): Promise<void> {
    await this.locateClaimableRewardsRow(index).getByRole('button', { name: 'Claim' }).click()
  }

  async clickClaimAllButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Claim all' }).click()
  }
  // #endregion

  // #region assertions
  async expectAmountToClaim(rewardIndex: number, amount: string): Promise<void> {
    await expect(
      this.locateClaimableRewardsRow(rewardIndex).getByTestId(testIds.sparkRewards.claimableRewardsPanel.amountToClaim),
    ).toHaveText(amount)
  }
  // #endregion
}
