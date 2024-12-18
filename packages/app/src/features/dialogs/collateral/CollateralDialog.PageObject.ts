import { TestContext } from '@/test/e2e/setup'
import { testIds } from '@/ui/utils/testIds'
import { expect } from '@playwright/test'
import { CollateralSetting } from '../collateral/types'
import { DialogPageObject } from '../common/Dialog.PageObject'

export class CollateralDialogPageObject extends DialogPageObject {
  constructor(testContext: TestContext<any>) {
    super({ testContext, header: /Collateral/ })
  }

  // #region actions
  async setUseAsCollateralAction({
    assetName,
    setting,
  }: {
    assetName: string
    setting: CollateralSetting
  }): Promise<void> {
    await this.actionsContainer.acceptAllActionsAction(1)

    // assertion used for waiting
    if (setting === 'enabled') {
      await this.expectSetUseAsCollateralSuccessPage(assetName, 'enabled')
    } else {
      await this.expectSetUseAsCollateralSuccessPage(assetName, 'disabled')
    }
  }
  // #endregion actions

  // #region assertions
  async expectSetUseAsCollateralSuccessPage(assetName: string, setting: CollateralSetting): Promise<void> {
    await expect(this.region.getByRole('heading', { name: 'Congrats, all done!' })).toBeVisible()
    await expect(this.region.getByTestId(testIds.dialog.success)).toContainText(assetName)
    await expect(this.region.getByTestId(testIds.dialog.success)).toContainText(`Collateral ${setting}`)
  }
  // #endregion assertions
}
