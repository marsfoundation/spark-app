import { DialogPageObject, TxOverviewWithRoute } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Locator, Page, expect } from '@playwright/test'

export class ConvertStablesDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Convert Tokens/)
  }

  // # region locators
  locateAssetInSelector(): Locator {
    return this.region.getByTestId(testIds.component.AssetSelector.trigger).first()
  }

  locateAssetOutSelector(): Locator {
    return this.region.getByTestId(testIds.component.AssetSelector.trigger).last()
  }

  locateAssetInInput(): Locator {
    return this.region.getByTestId(testIds.component.AssetInput.input).first()
  }

  locateAssetOutInput(): Locator {
    return this.region.getByTestId(testIds.component.AssetInput.input).last()
  }

  locateAssetInMaxButton(): Locator {
    return this.region.getByTestId(testIds.component.AssetInput.maxButton).first()
  }

  locateAssetOutMaxButton(): Locator {
    return this.region.getByTestId(testIds.component.AssetInput.maxButton).last()
  }
  // #endregion locators

  // #region actions
  async selectAssetInAction(asset: string): Promise<void> {
    const selector = this.locateAssetInSelector()
    await this.selectOptionByLabelAction(selector, asset)
  }

  async selectAssetOutAction(asset: string): Promise<void> {
    const selector = this.locateAssetOutSelector()
    await this.selectOptionByLabelAction(selector, asset)
  }

  async openAssetInSelectorAction(): Promise<void> {
    await this.locateAssetInSelector().click()
  }

  async openAssetOutSelectorAction(): Promise<void> {
    await this.locateAssetOutSelector().click()
  }

  async fillAmountInAction(amount: number): Promise<void> {
    await this.locateAssetInInput().fill(amount.toString())
  }

  async fillAmountOutAction(amount: number): Promise<void> {
    await this.locateAssetOutInput().fill(amount.toString())
  }

  async clickMaxAmountInAction(): Promise<void> {
    await this.locateAssetInMaxButton().click()
  }

  async clickMaxAmountOutAction(): Promise<void> {
    await this.locateAssetOutMaxButton().click()
  }

  async clickBackToSavingsButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Savings' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }
  // #endregion actions

  // #region assertions
  async expectSuccessPage(): Promise<void> {
    await expect(this.page.getByText('Congrats, all done!')).toBeVisible()
  }

  async expectTransactionOverview(transactionOverview: TxOverviewWithRoute): Promise<void> {
    await this.expectTransactionOverviewRoute(transactionOverview.routeItems)
    await this.expectOutcomeText(transactionOverview.outcome)
    if (transactionOverview.outcomeUsd) {
      await this.expectOutcomeUsdText(transactionOverview.outcomeUsd)
    }
  }

  async expectAssetInSelectorSelectedOption(option: string): Promise<void> {
    await expect(this.locateAssetInSelector()).toHaveText(option)
  }

  async expectAssetOutSelectorSelectedOption(option: string): Promise<void> {
    await expect(this.locateAssetOutSelector()).toHaveText(option)
  }

  async expectSelectorOptions(options: string[]): Promise<void> {
    const selectorOptions = await this.page.getByTestId(testIds.component.AssetSelector.option).all()
    expect(selectorOptions).toHaveLength(options.length)

    for (const [index, option] of selectorOptions.entries()) {
      await expect(option).toHaveText(options[index]!)
    }
  }

  async expectAssetInInputValue(value: string): Promise<void> {
    await expect(this.locateAssetInInput()).toHaveValue(value)
  }

  async expectAssetOutInputValue(value: string): Promise<void> {
    await expect(this.locateAssetOutInput()).toHaveValue(value)
  }

  async expectSingleInputError(error: string): Promise<void> {
    const inputError = this.page.getByTestId(testIds.component.AssetInput.error)
    await expect(inputError).toHaveCount(1)
    await expect(inputError).toHaveText(error)
  }
  // #endregion assertions
}
