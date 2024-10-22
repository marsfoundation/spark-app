import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class SavingsPageObject extends BasePageObject {
  // #region locators
  locateSavingsOpportunityPanel(): Locator {
    return this.locatePanelByHeader('Savings')
  }

  // @note using locatePanelByHeader didn't work for base chain because savings opportunity
  // panel header which is exactly the same as the token panel header
  locateSavingsDaiPanel(): Locator {
    return this.page.getByTestId(testIds.savings.sdai.panel)
  }

  locateSavingsUsdsPanel(): Locator {
    return this.page.getByTestId(testIds.savings.susds.panel)
  }

  locateUpgradeSDaiBanner(): Locator {
    return this.page.getByTestId(testIds.savings.upgradeSDaiBanner)
  }

  locateStablecoinsInWalletPanel(): Locator {
    return this.locatePanelByHeader('Stablecoins in wallet')
  }

  locateUpgradeDaiToUsdsButton(): Locator {
    return this.page.getByTestId(testIds.savings.stablecoinsInWallet.upgradeDaiToUsds)
  }

  locateDowngradeUsdsToDaiButton(): Locator {
    return this.page.getByTestId(testIds.savings.stablecoinsInWallet.downgradeUsdsToDai)
  }

  locateUsdsMoreDropdown(): Locator {
    const panel = this.locateStablecoinsInWalletPanel()
    const usdsRow = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: 'USDS', exact: true }) })
    return usdsRow.getByTestId(testIds.savings.stablecoinsInWallet.moreDropdown)
  }

  locateConvertStablesButton(): Locator {
    return this.page.getByTestId(testIds.component.ConvertStablesButton)
  }
  // #endregion

  // #region actions
  async clickStartSavingButtonAction(): Promise<void> {
    await this.locateSavingsOpportunityPanel().getByRole('button', { name: 'Start saving' }).click()
  }

  async clickDepositButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Stablecoins in wallet')
    const row = panel.getByRole('row').filter({ hasText: assetName }) // @todo: won't work for assets with names that contain other assets name, like sDAI
    await row.getByRole('button', { name: 'Deposit' }).click()
  }

  async clickWithdrawSDaiButtonAction(): Promise<void> {
    await this.locateSavingsDaiPanel().getByRole('button', { name: 'Withdraw' }).click()
  }

  async clickSendSDaiButtonAction(): Promise<void> {
    await this.locateSavingsDaiPanel().getByRole('button', { name: 'Send' }).click()
  }

  async clickWithdrawSUsdsButtonAction(): Promise<void> {
    await this.locateSavingsUsdsPanel().getByRole('button', { name: 'Withdraw' }).click()
  }

  async clickSendSUsdsButtonAction(): Promise<void> {
    await this.locateSavingsUsdsPanel().getByRole('button', { name: 'Send' }).click()
  }

  async clickUpgradeSDaiButtonAction(): Promise<void> {
    await this.locateUpgradeSDaiBanner().getByRole('button', { name: 'Upgrade now' }).click()
  }

  async clickUpgradeDaiToUsdsButtonAction(): Promise<void> {
    await this.locateUpgradeDaiToUsdsButton().click()
  }

  async clickDowngradeUsdsToDaiOption(): Promise<void> {
    await this.locateUsdsMoreDropdown().click()
    await this.page.getByRole('menuitem', { name: 'Downgrade to DAI' }).click()
  }

  async clickConvertStablesButtonAction(): Promise<void> {
    await this.locateConvertStablesButton().click()
  }
  // #endregion

  // #region assertions
  async expectAPY(value: string): Promise<void> {
    await expect(this.locateSavingsOpportunityPanel().getByRole('paragraph').filter({ hasText: value })).toBeVisible()
  }

  async expectConnectWalletCTA(): Promise<void> {
    await expect(
      this.locateSavingsOpportunityPanel().getByRole('button', { name: 'Connect wallet', exact: true }),
    ).toBeVisible()
    await expect(
      this.locatePanelByHeader('Connect your wallet and start saving!').getByRole('button', {
        name: 'Connect wallet',
        exact: true,
      }),
    ).toBeVisible()
  }

  async expectSavingsDaiBalance({
    sdaiBalance,
    estimatedDaiValue,
  }: { sdaiBalance: string; estimatedDaiValue: string }): Promise<void> {
    await expect(this.locateSavingsDaiPanel().getByTestId(testIds.savings.sdai.balance)).toContainText(sdaiBalance, {
      timeout: 60_000, // potentially should wait a bit for balance to reach the value because of timing issues in e2e tests
    })
    await expect(this.locateSavingsDaiPanel().getByTestId(testIds.savings.sdai.balanceInAsset)).toContainText(
      estimatedDaiValue,
      {
        timeout: 60_000,
      },
    )
  }

  async expectSavingsUsdsBalance({
    susdsBalance,
    estimatedUsdsValue,
  }: { susdsBalance: string; estimatedUsdsValue: string }): Promise<void> {
    await expect(this.locateSavingsUsdsPanel().getByTestId(testIds.savings.susds.balance)).toContainText(susdsBalance, {
      timeout: 60_000,
    })
    await expect(this.locateSavingsUsdsPanel().getByTestId(testIds.savings.susds.balanceInAsset)).toContainText(
      estimatedUsdsValue,
      {
        timeout: 60_000,
      },
    )
  }

  async expectSavingDaiCurrentProjection(value: string, type: '30-day' | '1-year'): Promise<void> {
    const title = type === '30-day' ? '30-day projection' : '1-year projection'
    await expect(
      this.locateSavingsDaiPanel().getByRole('generic').filter({ hasText: title }).getByText(value),
    ).toBeVisible()
  }

  async expectSavingUsdsCurrentProjection(value: string, type: '30-day' | '1-year'): Promise<void> {
    const title = type === '30-day' ? '30-day projection' : '1-year projection'
    await expect(
      this.locateSavingsUsdsPanel().getByRole('generic').filter({ hasText: title }).getByText(value),
    ).toBeVisible()
  }

  async expectOpportunityStablecoinsAmount(value: string): Promise<void> {
    await expect(this.page.getByTestId(testIds.savings.stablecoinsAmount).getByText(value)).toBeVisible()
  }

  async expectStablecoinsInWalletAssetBalance(assetName: string, value: string): Promise<void> {
    const panel = this.locateStablecoinsInWalletPanel()
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }

  expectUpgradeDaiToUsdsButtonToBeHidden(): Promise<void> {
    return expect(this.locateUpgradeDaiToUsdsButton()).toBeHidden()
  }

  expectUpgradeSDaiBannerToBeHidden(): Promise<void> {
    return expect(this.locateUpgradeSDaiBanner()).toBeHidden()
  }

  async expectDowngradeToDaiToBeDisabled(): Promise<void> {
    await this.locateUsdsMoreDropdown().click()

    return expect(this.locateDowngradeUsdsToDaiButton()).toBeDisabled()
  }

  async expectUpgradableDaiBalance(value: string): Promise<void> {
    const panel = this.locateStablecoinsInWalletPanel()
    const row = panel
      .getByRole('row')
      .filter({ has: this.page.getByTestId(testIds.savings.stablecoinsInWallet.upgradeDaiToUsds) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }
  // #endregion
}
