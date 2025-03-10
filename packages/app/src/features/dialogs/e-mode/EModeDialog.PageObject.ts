import { EModeCategoryName } from '@/domain/e-mode/types'
import { TestContext } from '@/test/e2e/setup'
import { testIds } from '@/ui/utils/testIds'
import { Locator, expect } from '@playwright/test'
import { DialogPageObject } from '../common/Dialog.PageObject'

export class EModeDialogPageObject extends DialogPageObject {
  constructor(testContext: TestContext) {
    super({
      testContext,
      header: /Set E-Mode Category/,
    })
  }

  // #region locators
  locateEModeCategoryTile(eModeCategoryName: EModeCategoryName): Locator {
    return this.region.getByRole('button', { name: eModeCategoryName })
  }
  // #endregion locators

  // #region actions
  async clickEModeCategoryTileAction(eModeCategoryName: EModeCategoryName): Promise<void> {
    await this.locateEModeCategoryTile(eModeCategoryName).click()
  }

  async setEModeAction(eModeCategoryName: EModeCategoryName): Promise<void> {
    await this.clickEModeCategoryTileAction(eModeCategoryName)
    await this.acknowledgeIfRiskIsPresent()
    await this.actionsContainer.acceptAllActionsAction(1)
    await this.expectEModeSuccessPage(eModeCategoryName)
    await this.viewInMyPortfolioAction()
  }
  // #endregion actions

  // #region assertions
  async expectEModeCategoryTileStatus(
    eModeCategoryName: EModeCategoryName,
    status: 'Active' | 'Inactive',
  ): Promise<void> {
    const tile = this.locateEModeCategoryTile(eModeCategoryName)
    await expect(tile).toContainText(status)
  }
  async expectEModeSuccessPage(eModeCategoryName: EModeCategoryName): Promise<void> {
    await expect(this.page.getByTestId(testIds.component.SuccessView.content)).toContainText('Congrats, all done!')
    await expect(this.page.getByTestId(testIds.dialog.success)).toContainText(eModeCategoryName)
    await expect(this.page.getByTestId(testIds.dialog.success)).toContainText('Option activated')
  }

  async expectEModeTransactionOverview(txOverview: EModeTransactionOverview): Promise<void> {
    const overviewPanel = this.locatePanelByHeader('Transaction overview')
    await expect(overviewPanel).toBeVisible()
    const ids = testIds.dialog.eMode.transactionOverview
    const { availableAssets, maxLtv, variant } = txOverview

    if (variant === 'e-mode-no-change') {
      if (availableAssets.category) {
        await expect(this.page.getByTestId(ids.availableAssets.category)).toHaveText(availableAssets.category)
      }
      await expect(this.page.getByTestId(ids.availableAssets.assets)).toHaveText(availableAssets.assets)
      await expect(this.page.getByTestId(ids.maxLtv.before)).toHaveText(maxLtv)
      await expect(this.page.getByTestId(testIds.dialog.healthFactor.before)).toContainText(txOverview.hf)
    }

    if (variant === 'e-mode-change') {
      if (availableAssets.category) {
        await expect(this.page.getByTestId(ids.availableAssets.category)).toHaveText(availableAssets.category)
      }
      await expect(this.page.getByTestId(ids.availableAssets.assets)).toHaveText(availableAssets.assets)
      await expect(this.page.getByTestId(ids.maxLtv.before)).toHaveText(maxLtv.before)
      await expect(this.page.getByTestId(ids.maxLtv.after)).toHaveText(maxLtv.after)
      await expect(this.page.getByTestId(testIds.dialog.healthFactor.before)).toContainText(txOverview.hf.before)
      await expect(this.page.getByTestId(testIds.dialog.healthFactor.after)).toContainText(txOverview.hf.after)
    }

    if (variant === 'no-borrow') {
      if (availableAssets.category) {
        await expect(this.page.getByTestId(ids.availableAssets.category)).toHaveText(availableAssets.category)
      }
      await expect(this.page.getByTestId(ids.availableAssets.assets)).toHaveText(availableAssets.assets)
      await expect(this.page.getByTestId(ids.maxLtv.before)).toHaveText(maxLtv.before)
      await expect(this.page.getByTestId(ids.maxLtv.after)).toHaveText(maxLtv.after)
    }
  }
  // #endregion assertions
}

type EModeTransactionOverview =
  | {
      variant: 'e-mode-change'
      availableAssets: {
        category?: string
        assets: string
      }
      maxLtv: {
        before: string
        after: string
      }
      hf: {
        before: string
        after: string
      }
    }
  | {
      variant: 'e-mode-no-change'
      availableAssets: {
        category?: string
        assets: string
      }
      maxLtv: string
      hf: string
    }
  | {
      variant: 'no-borrow'
      availableAssets: {
        category?: string
        assets: string
      }
      maxLtv: {
        before: string
        after: string
      }
    }
