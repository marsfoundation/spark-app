import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'
import { Locator, expect } from '@playwright/test'

export class FarmDetailsPageObject extends BasePageObject {
  // #region locators
  locateTokensToDepositPanel(): Locator {
    return this.locatePanelByHeader('Tokens to deposit')
  }
  // #endregion

  // #region actions
  async clickInfoPanelStakeButtonAction(): Promise<void> {
    await this.page.getByTestId(testIds.farmDetails.infoPanel.stakeButton).click()
  }
  // #endregion

  // #region assertions
  async expectTokenToDepositBalance(assetName: string, value: string): Promise<void> {
    const panel = this.locateTokensToDepositPanel()
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }

  async expectStake({ stake, reward }: { stake: string; reward: string }): Promise<void> {
    await expect(this.page.getByTestId(testIds.farmDetails.activeFarmInfoPanel.staked)).toContainText(stake.toString())
    await expect(this.page.getByTestId(testIds.farmDetails.activeFarmInfoPanel.rewards)).toContainText(
      reward.toString(),
    )
  }
  // #endregion
}
