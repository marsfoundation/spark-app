import { Locator, Page, expect } from '@playwright/test'

import { testIds } from '@/ui/utils/testIds'

import { DialogPageObject } from '../common/Dialog.PageObject'

export class ClaimRewardsDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /.*/)
    this.region = this.locateDialogByHeader('Claim rewards')
  }

  // #region assertions
  async expectRewards(rows: Reward[], locator?: Locator): Promise<void> {
    if (!locator) {
      locator = this.region
    }

    for (const [index, row] of rows.entries()) {
      const rowLocator = this.page.getByTestId(testIds.dialog.claimRewards.transactionOverview.row(index)).first()
      await expect(rowLocator.getByTestId(testIds.dialog.claimRewards.transactionOverview.token)).toHaveText(
        row.tokenSymbol,
      )
      await expect(rowLocator.getByTestId(testIds.dialog.claimRewards.transactionOverview.amount)).toHaveText(
        row.amount,
      )
      await expect(rowLocator.getByTestId(testIds.dialog.claimRewards.transactionOverview.amountUSD)).toHaveText(
        row.amountUSD,
      )
    }
  }

  async expectClaimRewardsSuccessPage(rows: Reward[]): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Congrats, all done!!' })).toBeVisible()
    await this.expectRewards(rows, this.page.getByTestId(testIds.dialog.success))
  }
  // #endregion assertions
}

interface Reward {
  tokenSymbol: string
  amount: string
  amountUSD: string
}
