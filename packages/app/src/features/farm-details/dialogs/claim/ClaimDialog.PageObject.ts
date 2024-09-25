import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'

export class ClaimDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Claim/)
  }

  // #region actions
  async clickBackToFarmAction(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Farm' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }
  //

  // #region assertions
  async expectTransactionOverview(transactionOverview: TransactionOverview): Promise<void> {
    await expect(
      this.page.getByTestId(testIds.farmDetails.claimDialog.transactionOverview.rewardTokenSymbol),
    ).toContainText(transactionOverview.reward.token.symbol)
    await expect(
      this.page.getByTestId(testIds.farmDetails.claimDialog.transactionOverview.rewardTokenDescription),
    ).toContainText(transactionOverview.reward.token.description)
    await expect(this.page.getByTestId(testIds.farmDetails.claimDialog.transactionOverview.rewardAmount)).toContainText(
      transactionOverview.reward.amount,
    )
    await expect(
      this.page.getByTestId(testIds.farmDetails.claimDialog.transactionOverview.rewardAmountUSD),
    ).toContainText(transactionOverview.reward.amountUSD)
  }

  async expectSuccessPage(): Promise<void> {
    // for now we only check if the success message is visible
    await expect(this.page.getByText('Congrats, all done!')).toBeVisible()
  }
  // #endregion
}

export interface TransactionOverview {
  reward: {
    token: {
      symbol: string
      description: string
    }
    amount: string
    amountUSD: string
  }
}
