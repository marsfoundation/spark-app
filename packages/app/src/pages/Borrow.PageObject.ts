import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BasePageObject } from '@/test/e2e/BasePageObject'
import { TestTokenWithValue, expectAssets } from '@/test/e2e/assertions'
import { TestContext, buildUrl } from '@/test/e2e/setup'
import { testIds } from '@/ui/utils/testIds'
import { expect } from '@playwright/test'

export class BorrowPageObject extends BasePageObject {
  public readonly actionsContainer: ActionsPageObject

  constructor(testContext: TestContext) {
    super(testContext)
    this.actionsContainer = new ActionsPageObject(testContext, this.locatePanelByHeader('Actions'))
  }

  // #region actions
  async fillDepositAssetAction(index: number, asset: string, amount: number): Promise<void> {
    const inputGroup = this.page
      .getByTestId(testIds.easyBorrow.form.deposits)
      .getByTestId(testIds.component.MultiAssetSelector.group)
      .nth(index)

    const selector = inputGroup.getByTestId(testIds.component.AssetSelector.trigger)
    await this.selectOptionByLabelAction(selector, asset)

    await inputGroup.getByRole('textbox').fill(amount.toString())
  }

  async selectBorrowAction(assetName: string): Promise<void> {
    const borrowSelector = this.page
      .getByTestId(testIds.easyBorrow.form.borrow)
      .getByTestId(testIds.component.AssetSelector.trigger)
    await this.selectOptionByLabelAction(borrowSelector, assetName)
  }

  async fillBorrowAssetAction(amount: number): Promise<void> {
    const borrowForm = this.page.getByTestId(testIds.easyBorrow.form.borrow)

    await borrowForm.getByRole('textbox').fill(amount.toString())
  }

  async submitAction(): Promise<void> {
    await this.page.locator('main').getByRole('button', { name: 'Borrow' }).click()
  }

  async addNewDepositAssetAction(): Promise<void> {
    return this.page.getByRole('button', { name: 'Add more' }).click()
  }

  async viewInMyPortfolioAction(): Promise<void> {
    await this.page.getByRole('link', { name: 'View in portfolio' }).click()
  }

  async viewInSavingsAction(): Promise<void> {
    await this.page.getByRole('link', { name: 'View in Savings' }).click()
  }

  async depositAssetsActions({
    assetsToDeposit,
    daiToBorrow,
  }: {
    assetsToDeposit: Record<string, number>
    daiToBorrow: number
  }): Promise<void> {
    await this.depositWithoutBorrowActions({
      assetsToDeposit,
      daiToBorrow,
    })
    await this.actionsContainer.acceptActionAtIndex(Object.entries(assetsToDeposit).length * 2) // accept final borrow action
  }

  async depositWithoutBorrowActions({
    assetsToDeposit,
    daiToBorrow,
  }: {
    assetsToDeposit: Record<string, number>
    daiToBorrow?: number
  }): Promise<void> {
    let index = 0
    for (const [asset, amount] of Object.entries(assetsToDeposit)) {
      if (index !== 0) {
        await this.addNewDepositAssetAction()
      }
      await this.fillDepositAssetAction(index, asset, amount)
      index++
    }
    await this.fillBorrowAssetAction(daiToBorrow ?? 1) // defaulted value won't matter, if only depositing
    await this.submitAction()
    await this.actionsContainer.acceptAllActionsAction(2 * index) // omitting the borrow action
    await this.actionsContainer.expectEnabledActionAtIndex(2 * index)
  }

  async goToEasyBorrowAction(): Promise<void> {
    await this.page.goto(buildUrl('easyBorrow'))
  }
  // #endregion actions

  // #region assertions
  async expectLtv(ltv: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.easyBorrow.form.ltv)).toHaveText(ltv)
  }

  async expectHealthFactor(hf: string): Promise<void> {
    const locator = this.page.getByTestId(testIds.component.HealthFactorGauge.value).nth(0) // is rendered twice because of mobile view
    await expect(locator).toHaveText(hf)
  }

  async expectAssetInputInvalid(errorText: string): Promise<void> {
    const locator = this.page.getByTestId(testIds.component.AssetInput.error)
    await expect(locator).toHaveText(errorText)
  }

  async expectAssetNotListedInDepositSelector(asset: string): Promise<void> {
    const depositSelector = this.page
      .getByTestId(testIds.easyBorrow.form.deposits)
      .getByTestId(testIds.component.MultiAssetSelector.group)
      .getByTestId(testIds.component.AssetSelector.trigger)
    await depositSelector.click()
    await expect(this.page.getByRole('listbox')).not.toHaveText(asset)
  }

  async expectBorrowButtonActive(): Promise<void> {
    await expect(this.page.locator('main').getByRole('button', { name: 'Borrow' })).toBeEnabled()
  }

  async expectSuccessPage({
    deposited,
    borrowed,
  }: {
    deposited: TestTokenWithValue[]
    borrowed: TestTokenWithValue
  }): Promise<void> {
    await expect(this.page.getByText('Congrats, all done!')).toBeVisible()

    if (deposited.length > 0) {
      const depositSummary = await this.page.getByTestId(testIds.easyBorrow.success.deposited).textContent()
      expectAssets(depositSummary!, deposited)
    }

    const borrowSummary = await this.page.getByTestId(testIds.easyBorrow.success.borrowed).textContent()
    expectAssets(borrowSummary!, [borrowed])
  }
  // #endregion
}
