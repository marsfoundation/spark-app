import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'
import { DialogPageObject } from '../../../common/Dialog.PageObject'

export class SavingsDialogPageObject extends DialogPageObject {
  private readonly type: 'deposit' | 'withdraw'
  constructor({ page, type }: { page: Page; type: 'deposit' | 'withdraw' }) {
    super(page, new RegExp(`${type === 'deposit' ? 'Deposit to' : 'Withdraw from'} Savings`))
    this.type = type
  }

  // #region actions
  async clickBackToSavingsButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Savings' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }

  async clickAcknowledgeRisk(): Promise<void> {
    await this.page.getByTestId(testIds.dialog.acknowledgeRiskSwitch).click()
  }
  // #endregion

  // #region assertions
  async expectDiscrepancyWarning(discrepancy: string): Promise<void> {
    const explanation =
      this.type === 'deposit'
        ? 'The final amount received may be less than the deposit amount by up to'
        : 'You may be charged more than the withdraw amount by up to'
    await expect(
      this.region.getByText(`Market fluctuations can impact your transaction value. ${explanation} ${discrepancy}`),
    ).toBeVisible()
  }

  async expectTransactionOverviewToBeVisible(): Promise<void> {
    await expect(this.locatePanelByHeader('Transaction overview')).toBeVisible()
  }

  async expectTransactionOverview(transactionOverview: TransactionOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()

    for (const [index, [label, value]] of transactionOverview.entries()) {
      const row = panel.getByTestId(testIds.dialog.depositSavings.transactionDetailsRow(index))
      await expect(row).toBeVisible()
      await expect(row).toContainText(label)
      await expect(row).toContainText(value)
    }
  }

  async expectNativeRouteTransactionOverview(transactionOverview: NativeRouteTransactionOverview): Promise<void> {
    const panel = this.locatePanelByHeader('Transaction overview')
    await expect(panel).toBeVisible()
    const txOverviewTestIds = testIds.dialog.savings.nativeRouteTransactionOverview

    const apyValue = panel.getByTestId(txOverviewTestIds.apy.value)
    const apyDescription = panel.getByTestId(txOverviewTestIds.apy.description)
    await expect(apyValue).toContainText(transactionOverview.apy.value)
    await expect(apyDescription).toContainText(transactionOverview.apy.description)

    for (const [index, { tokenAmount: tokenWithAmount, tokenUsdValue }] of transactionOverview.routeItems.entries()) {
      const routeItem = panel.getByTestId(txOverviewTestIds.routeItem.tokenWithAmount(index))
      const routeItemUSD = panel.getByTestId(txOverviewTestIds.routeItem.tokenUsdValue(index))
      await expect(routeItem).toContainText(tokenWithAmount)
      await expect(routeItemUSD).toContainText(tokenUsdValue)
    }

    const makerBadge = panel.getByTestId(txOverviewTestIds.makerBadge)
    await expect(makerBadge).toBeVisible()

    const outcome = panel.getByTestId(txOverviewTestIds.outcome)
    await expect(outcome).toContainText(transactionOverview.outcome)
  }

  async expectToUseNativeSDaiAction({
    asset,
    amount,
  }: {
    asset: string
    amount: number
  }): Promise<void> {
    const actionsContainer = new ActionsPageObject(this.locatePanelByHeader('Actions'))
    if (this.type === 'deposit') {
      await actionsContainer.expectActions([
        { type: 'approve', asset },
        { type: 'nativeSDaiDeposit', asset },
      ])
    } else {
      await actionsContainer.expectActions([{ type: 'nativeSDaiWithdraw', asset }])
    }
  }

  async expectToUseLifiSwap(lifiSwapParams: LifiSwapParams): Promise<void> {
    const exchangeRow = this.locatePanelByHeader('Actions').getByTestId(
      testIds.actions.flavours.exchangeActionRow.wrapper,
    )

    await expect(exchangeRow).toBeVisible()
    await expect(exchangeRow).toContainText(lifiSwapParams.title)
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.lifiBadge)).toBeVisible()
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.fee)).toHaveText(lifiSwapParams.fee)
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.slippage)).toHaveText(
      lifiSwapParams.slippage,
    )
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.finalDAIAmount)).toContainText(
      lifiSwapParams.finalDAIAmount,
    )
    await expect(exchangeRow.getByTestId(testIds.actions.flavours.exchangeActionRow.finalSDAIAmount)).toHaveText(
      lifiSwapParams.finalSDAIAmount,
    )
  }

  async expectSuccessPage(): Promise<void> {
    // for now we only check if the success message is visible
    await expect(this.page.getByText('Congrats! All done!')).toBeVisible()
  }

  // #endregion
}

interface LifiSwapParams {
  title: string
  slippage: string
  fee: string
  finalSDAIAmount: string
  finalDAIAmount: string
}

type TransactionOverview = [string, string][]

interface NativeRouteTransactionOverview {
  apy: {
    value: string
    description: string
  }
  routeItems: {
    tokenAmount: string
    tokenUsdValue: string
  }[]
  outcome: string
}
