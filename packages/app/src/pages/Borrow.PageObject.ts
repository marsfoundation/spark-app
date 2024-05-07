import { expect } from '@playwright/test'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { expectAssets, TestTokenWithValue } from '@/test/e2e/assertions'
import { BasePageObject } from '@/test/e2e/BasePageObject'
import { buildUrl } from '@/test/e2e/setup'
import { ForkContext } from '@/test/e2e/setupFork'
import { calculateAssetsWorth } from '@/test/e2e/utils'
import { testIds } from '@/ui/utils/testIds'

export class BorrowPageObject extends BasePageObject {
  // #region actions
  async fillDepositAssetAction(index: number, asset: string, amount: number): Promise<void> {
    const inputGroup = this.page
      .getByTestId(testIds.easyBorrow.form.deposits)
      .getByTestId(testIds.component.MultiAssetSelector.group)
      .nth(index)

    const selector = inputGroup.getByTestId(testIds.component.AssetSelector)
    await this.selectOptionByLabelAction(selector, asset)

    await inputGroup.getByRole('textbox').fill(amount.toString())
  }

  async fillBorrowAssetAction(amount: number): Promise<void> {
    const borrowForm = this.page.getByTestId(testIds.easyBorrow.form.borrow)

    await borrowForm.getByRole('textbox').fill(amount.toString())
  }

  async submitAction(): Promise<void> {
    await this.page.getByRole('button', { name: 'Borrow' }).click()
  }

  async addNewDepositAssetAction(): Promise<void> {
    return this.page.getByRole('button', { name: 'Add more' }).click()
  }

  async viewInDashboardAction(): Promise<void> {
    await this.page.getByRole('link', { name: 'View in dashboard' }).click()
  }

  async depositAssetsActions(assetsToDeposit: Record<string, number>, daiToBorrow: number): Promise<void> {
    const actionsContainer = new ActionsPageObject(this.locatePanelByHeader('Actions'))
    await this.depositWithoutBorrowActions(assetsToDeposit, daiToBorrow, actionsContainer)
    await actionsContainer.acceptAllActionsAction(1) // borrow action
  }

  async depositWithoutBorrowActions(
    assetsToDeposit: Record<string, number>,
    daiToBorrow?: number,
    _actionsContainer?: ActionsPageObject,
  ): Promise<void> {
    const actionsContainer = _actionsContainer ?? new ActionsPageObject(this.locatePanelByHeader('Actions'))

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
    await actionsContainer.acceptAllActionsAction(2 * index) // omitting the borrow action
    await actionsContainer.expectNextActionEnabled()
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
    const locator = this.page.getByTestId(testIds.component.HealthFactorBadge.value)
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
      .getByTestId(testIds.component.AssetSelector)
    await depositSelector.click()
    await expect(this.page.getByRole('listbox')).not.toHaveText(asset)
  }

  async expectBorrowButtonActive(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Borrow' })).toBeEnabled()
  }

  async expectSuccessPage(
    deposited: TestTokenWithValue[],
    borrowed: TestTokenWithValue,
    fork: ForkContext,
  ): Promise<void> {
    await expect(this.page.getByText('Congrats! All done!')).toBeVisible()

    const transformed = [...deposited, borrowed].reduce(
      (acc, { asset, amount: value }) => ({ ...acc, [asset]: value }),
      {},
    )

    const { assetsWorth } = await calculateAssetsWorth(fork.forkUrl, transformed)

    if (deposited.length > 0) {
      const depositSummary = await this.page.getByTestId(testIds.easyBorrow.success.deposited).textContent()
      expectAssets(depositSummary!, deposited, assetsWorth)
    }

    const borrowSummary = await this.page.getByTestId(testIds.easyBorrow.success.borrowed).textContent()
    expectAssets(borrowSummary!, [borrowed], assetsWorth)
  }
  // #endregion
}
