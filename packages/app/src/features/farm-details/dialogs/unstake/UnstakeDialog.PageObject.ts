import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'

export class UnstakeDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Withdraw/)
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
    for (let i = 0; i < transactionOverview.route.swaps.length; i++) {
      await expect(
        this.page.getByTestId(testIds.dialog.transactionOverview.routeItem.tokenWithAmount(i)),
      ).toContainText(transactionOverview.route.swaps[i]!.tokenAmount)
      await expect(this.page.getByTestId(testIds.dialog.transactionOverview.routeItem.tokenUsdValue(i))).toContainText(
        transactionOverview.route.swaps[i]!.tokenUsdValue,
      )
    }

    await expect(
      this.page.getByTestId(testIds.farmDetails.unstakeDialog.transactionOverview.route.farm.farmName),
    ).toContainText(transactionOverview.route.farm.upperText)
    await expect(
      this.page.getByTestId(testIds.farmDetails.unstakeDialog.transactionOverview.route.farm.stakingToken),
    ).toContainText(transactionOverview.route.farm.lowerText)
    await expect(this.page.getByTestId(testIds.farmDetails.unstakeDialog.transactionOverview.outcome)).toContainText(
      transactionOverview.outcome,
    )
  }

  async expectSuccessPage(): Promise<void> {
    // for now we only check if the success message is visible
    await expect(this.page.getByText('Congrats, all done!')).toBeVisible()
  }
  // #endregion
}

export interface TransactionOverview {
  route: {
    swaps: {
      tokenAmount: string
      tokenUsdValue: string
    }[]
    farm: {
      upperText: string
      lowerText: string
    }
  }
  outcome: string
}
