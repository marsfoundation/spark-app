import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class SavingsPageObject extends BasePageObject {
  // #region locators

  // @note using locatePanelByHeader didn't work for base chain because savings opportunity
  // panel header which is exactly the same as the token panel header
  locateDepositCTAPanel(): Locator {
    return this.page.getByTestId(testIds.savings.account.depositCTA.panel)
  }

  locateAccountMainPanel(): Locator {
    return this.page.getByTestId(testIds.savings.account.mainPanel.container)
  }

  locateUpgradeSDaiBanner(): Locator {
    return this.page.getByTestId(testIds.savings.upgradeSDaiBanner)
  }

  locateSupportedStablecoinsPanel(): Locator {
    return this.locatePanelByHeader('Supported stablecoins')
  }

  locateUsdsMoreDropdown(): Locator {
    const panel = this.locateSupportedStablecoinsPanel()
    const usdsRow = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: 'USDS', exact: true }) })
    return usdsRow.getByTestId(testIds.savings.supportedStablecoins.moreDropdown)
  }

  locateConvertStablesButton(): Locator {
    return this.page.getByTestId(testIds.component.ConvertStablesButton)
  }

  locateSavingsNavigationItem(account: string): Locator {
    return this.page.getByTestId(testIds.savings.navigation.item).filter({ hasText: account }).first()
  }
  // #endregion

  // #region actions
  async clickCTADepositButtonAction(): Promise<void> {
    await this.locateDepositCTAPanel().getByRole('button', { name: 'Deposit' }).click()
  }

  async clickDepositButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Supported stablecoins')
    const row = panel.getByRole('row').filter({ hasText: assetName }) // @todo: won't work for assets with names that contain other assets name, like sDAI
    await row.getByRole('button', { name: 'Deposit' }).click()
  }

  async clickWithdrawFromAccountButtonAction(): Promise<void> {
    await this.locateAccountMainPanel().getByRole('button', { name: 'Withdraw' }).click()
  }

  async clickSendFromAccountButtonAction(): Promise<void> {
    await this.locateAccountMainPanel().getByRole('button', { name: 'Send' }).click()
  }

  async clickUpgradeSDaiButtonAction(): Promise<void> {
    await this.locateUpgradeSDaiBanner().getByRole('button', { name: 'Upgrade now' }).click()
  }

  async clickConvertStablesButtonAction(): Promise<void> {
    await this.locateConvertStablesButton().click()
  }

  async clickSavingsNavigationItemAction(account: string): Promise<void> {
    await this.locateSavingsNavigationItem(account).click()
  }
  // #endregion

  // #region assertions
  async expectDepositCtaPanelApy(value: string): Promise<void> {
    await expect(this.locateDepositCTAPanel().getByTestId(testIds.savings.account.depositCTA.apy)).toHaveText(value)
  }

  async expectConnectWalletCTA(): Promise<void> {
    await expect(
      this.locateDepositCTAPanel().getByRole('button', { name: 'Connect Wallet', exact: true }),
    ).toBeVisible()
  }

  async expectSavingsAccountBalance({
    balance,
    estimatedValue,
  }: { balance: string; estimatedValue: string }): Promise<void> {
    await expect(this.locateAccountMainPanel().getByTestId(testIds.savings.account.savingsToken.balance)).toContainText(
      balance,
    )
    await expect(
      this.locateAccountMainPanel().getByTestId(testIds.savings.account.savingsToken.balanceInUnderlyingToken),
    ).toContainText(estimatedValue)
  }

  async expectNavigationItemBalance(account: string, balance: string): Promise<void> {
    await expect(
      this.locateSavingsNavigationItem(account).getByTestId(testIds.savings.navigation.itemBalance),
    ).toHaveText(balance)
  }

  async expectNavigationItemBalanceToBeInvisible(account: string): Promise<void> {
    await expect(
      this.locateSavingsNavigationItem(account).getByTestId(testIds.savings.navigation.itemBalance),
    ).toBeHidden()
  }

  async expectNavigationToBeInvisible(): Promise<void> {
    await expect(this.page.getByTestId(testIds.savings.navigation.container)).toBeHidden()
  }

  async expectAccountMainPanelApy(value: string): Promise<void> {
    await expect(this.locateAccountMainPanel().getByTestId(testIds.savings.account.mainPanel.apy)).toHaveText(value)
  }

  async expect1YearProjection(value: string): Promise<void> {
    await expect(
      this.locateAccountMainPanel().getByTestId(testIds.savings.account.mainPanel.oneYearProjection),
    ).toHaveText(value)
  }

  async expectSupportedStablecoinBalance(assetName: string, value: string): Promise<void> {
    const panel = this.locateSupportedStablecoinsPanel()
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }

  async expectUpgradeSDaiBannerToBeHidden(): Promise<void> {
    await expect(this.locateUpgradeSDaiBanner()).toBeHidden()
  }

  // #endregion
}
