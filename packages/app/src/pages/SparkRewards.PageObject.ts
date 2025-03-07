import { expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class SparkRewardsPageObject extends BasePageObject {
  // #region actions
  async clickClaimButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Claim' }).first().click()
  }
  // #endregion

  // #region assertions
  async expectAmountToClaim(amount: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.sparkRewards.claimableRewardsPanel.amountToClaim)).toHaveText(amount)
  }
  // #endregion
}
