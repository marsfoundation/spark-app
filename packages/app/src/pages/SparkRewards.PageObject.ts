import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'
import { mainnet } from 'viem/chains'

export class SparkRewardsPageObject extends BasePageObject {
  // #region locators
  locateClaimableRewardsRow(index: number): Locator {
    return this.locatePanelByHeader('Claimable rewards').getByTestId(testIds.component.DataTable.row(index))
  }

  locateOngoingCampaignsRow(index: number): Locator {
    return this.locatePanelByHeader('Earn rewards').getByTestId(testIds.sparkRewards.ongoingCampaignsPanel.row(index))
  }
  // #endregion

  // #region actions
  async clickClaimButton(index: number): Promise<void> {
    await this.locateClaimableRewardsRow(index).getByRole('button', { name: 'Claim' }).click()
  }

  async clickClaimAllButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Claim all' }).click()
  }

  async clickStartCampaignButton(index: number): Promise<void> {
    await this.locateOngoingCampaignsRow(index)
      .getByTestId(testIds.sparkRewards.ongoingCampaignsPanel.startButton)
      .click()
  }
  // #endregion

  // #region assertions
  async expectAmountToClaim(rewardIndex: number, amount: string): Promise<void> {
    await expect(
      this.locateClaimableRewardsRow(rewardIndex).getByTestId(testIds.sparkRewards.claimableRewardsPanel.amountToClaim),
    ).toHaveText(amount)
  }

  async expectOngoingCampaignsRow(index: number, text: string): Promise<void> {
    await expect(this.locateOngoingCampaignsRow(index)).toContainText(text)
  }

  async expectToBeRedirectedToMarketDetails(assetAddress: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/markets/${mainnet.id}/${assetAddress}`))
  }
  // #endregion
}
