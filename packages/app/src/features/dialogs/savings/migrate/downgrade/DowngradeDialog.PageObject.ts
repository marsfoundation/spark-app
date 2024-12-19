// import { DialogPageObject, TxOverviewWithRoute } from '@/features/dialogs/common/Dialog.PageObject'
// import { testIds } from '@/ui/utils/testIds'
// import { Page, expect } from '@playwright/test'

// export class DowngradeDialogPageObject extends DialogPageObject {
//   constructor(page: Page) {
//     super(page, /Downgrade/)
//   }

//   // #region actions
//   async clickBackToSavingsButton(): Promise<void> {
//     await this.page.getByRole('button', { name: 'Back to Savings' }).click()
//     await this.region.waitFor({
//       state: 'detached',
//     })
//   }
//   // #endregion actions

//   // #region assertions
//   async expectTransactionOverview(transactionOverview: TxOverviewWithRoute): Promise<void> {
//     await this.expectTransactionOverviewRoute(transactionOverview.routeItems)
//     if (transactionOverview.badgeTokens) {
//       await this.expectSkyBadgeForTokens(transactionOverview.badgeTokens)
//     }
//     await this.expectOutcomeText(transactionOverview.outcome)
//   }

//   async expectDowngradeSuccessPage({
//     token,
//     amount,
//     usdValue,
//   }: { token: string; amount: string; usdValue: string }): Promise<void> {
//     await expect(this.region.getByText('Congrats, all done!')).toBeVisible()
//     const summary = await this.region.getByTestId(testIds.dialog.success).textContent()
//     await expect(summary).toMatch(`${token}${amount} ${usdValue}`)
//   }
//   // #endregion assertions
// }
