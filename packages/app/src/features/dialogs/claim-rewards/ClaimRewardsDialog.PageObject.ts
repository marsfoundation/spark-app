import { TestContext } from '@/test/e2e/setup'
import { testIds } from '@/ui/utils/testIds'
import { Locator, expect } from '@playwright/test'
import { DialogPageObject } from '../common/Dialog.PageObject'

export class ClaimRewardsDialogPageObject extends DialogPageObject {
  constructor(testContext: TestContext) {
    super({ testContext, header: /Claim rewards/ })
  }

  // #region assertions
  async expectRewards(rows: Reward[], locator?: Locator): Promise<void> {
    if (!locator) {
      locator = this.region
    }

    for (const [index, row] of rows.entries()) {
      const rowLocator = this.page.getByTestId(testIds.dialog.claimRewards.transactionOverview.row(index)).first()
      await expect(rowLocator.getByTestId(testIds.dialog.claimRewards.transactionOverview.amount)).toHaveText(
        `${row.amount} ${row.tokenSymbol}`,
      )
      await expect(rowLocator.getByTestId(testIds.dialog.claimRewards.transactionOverview.amountUSD)).toHaveText(
        row.amountUSD,
      )
    }
  }

  async expectClaimRewardsSuccessPage(rows: Reward[]): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Congrats, all done!' })).toBeVisible()
    for (const [index, row] of rows.entries()) {
      const rowLocator = this.page.getByTestId(testIds.component.SuccessView.row(index))
      await expect(rowLocator.getByTestId(testIds.component.SuccessView.tokenRow.token)).toHaveText(row.tokenSymbol)
      await expect(rowLocator.getByTestId(testIds.component.SuccessView.tokenRow.amount)).toHaveText(row.amount)
      await expect(rowLocator.getByTestId(testIds.component.SuccessView.tokenRow.amountUSD)).toHaveText(row.amountUSD)
    }
  }
  // #endregion assertions
}

interface Reward {
  tokenSymbol: string
  amount: string
  amountUSD: string
}
