import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'

export class StakeDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Deposit/)
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
      this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.route.destination.farmName),
    ).toContainText(transactionOverview.route.final.upperText)
    await expect(
      this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.route.destination.stakingToken),
    ).toContainText(transactionOverview.route.final.lowerText)
    await expect(this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.outcome)).toContainText(
      transactionOverview.outcome,
    )
    if (transactionOverview.estimatedRewards) {
      await expect(
        this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.apy),
      ).toContainText(transactionOverview.estimatedRewards.apy)
      await expect(
        this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.description),
      ).toContainText(transactionOverview.estimatedRewards.description)
    } else {
      await expect(
        this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.apy),
      ).toBeHidden()
      await expect(
        this.page.getByTestId(testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.description),
      ).toBeHidden()
    }
  }

  async expectSuccessPage(): Promise<void> {
    // for now we only check if the success message is visible
    await expect(this.page.getByText('Congrats, all done!')).toBeVisible()
  }
  // #endregion
}

export interface TransactionOverview {
  estimatedRewards?: {
    apy: string
    description: string
  }
  route: {
    swaps: {
      tokenAmount: string
      tokenUsdValue: string
    }[]
    final: {
      upperText: string
      lowerText: string
    }
  }
  outcome: string
}
