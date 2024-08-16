import { Locator, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export class SavingsPageObject extends BasePageObject {
  // #region locators
  locateSavingsOpportunityPanel(): Locator {
    return this.locatePanelByHeader('Savings opportunity')
  }

  locateSavingsDAIPanel(): Locator {
    return this.locatePanelByHeader('Savings DAI')
  }

  locateSavingsNSTPanel(): Locator {
    return this.locatePanelByHeader('Savings NST')
  }

  locateCashInWalletPanel(): Locator {
    return this.locatePanelByHeader('Cash in wallet')
  }

  locateUpgradeDaiToNstButton(): Locator {
    return this.page.getByTestId(testIds.savings.cashInWallet.upgradeDaiToNst)
  }

  locateNstMoreDropdown(): Locator {
    const panel = this.locateCashInWalletPanel()
    const nstRow = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: 'NST', exact: true }) })
    return nstRow.getByTestId(testIds.savings.cashInWallet.moreDropdown)
  }
  // #endregion

  // #region actions
  async clickStartSavingButtonAction(): Promise<void> {
    await this.locateSavingsOpportunityPanel().getByRole('button', { name: 'Start saving' }).click()
  }

  async clickDepositButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Cash in wallet')
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await row.getByRole('button', { name: 'Deposit' }).click()
  }

  async clickWithdrawSDaiButtonAction(): Promise<void> {
    await this.locateSavingsDAIPanel().getByRole('button', { name: 'Withdraw' }).click()
  }

  async clickSendSDaiButtonAction(): Promise<void> {
    await this.locateSavingsDAIPanel().getByRole('button', { name: 'Send' }).click()
  }

  async clickWithdrawSNstButtonAction(): Promise<void> {
    await this.locateSavingsNSTPanel().getByRole('button', { name: 'Withdraw' }).click()
  }

  async clickSendSNstButtonAction(): Promise<void> {
    await this.locateSavingsNSTPanel().getByRole('button', { name: 'Send' }).click()
  }

  async clickUpgradeDaiToNstButtonAction(): Promise<void> {
    await this.locateUpgradeDaiToNstButton().click()
  }

  async clickDowngradeNstToDaiOption(): Promise<void> {
    await this.locateNstMoreDropdown().click()
    await this.page.getByRole('menuitem', { name: 'Downgrade to DAI' }).click()
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

  async expectCurrentWorth(approximateValue: string): Promise<void> {
    await expect(this.locatePanelByHeader('Savings DAI').getByText(approximateValue)).toBeVisible()
  }

  async expectSavingsDAIBalance({
    sDaiBalance,
    estimatedDaiValue,
  }: { sDaiBalance: string; estimatedDaiValue: string }): Promise<void> {
    await expect(this.locatePanelByHeader('Savings DAI').getByTestId(testIds.savings.sDaiBalance)).toHaveText(
      sDaiBalance,
    )
    await expect(this.locatePanelByHeader('Savings DAI').getByTestId(testIds.savings.sDaiBalanceInDai)).toContainText(
      estimatedDaiValue,
    )
  }

  async expectSavingsNSTBalance({
    sNstBalance,
    estimatedNstValue,
  }: { sNstBalance: string; estimatedNstValue: string }): Promise<void> {
    await expect(this.locatePanelByHeader('Savings NST').getByTestId(testIds.savings.sDaiBalance)).toHaveText(
      sNstBalance,
    )
    await expect(this.locatePanelByHeader('Savings NST').getByTestId(testIds.savings.sDaiBalanceInDai)).toContainText(
      estimatedNstValue,
    )
  }

  async expectCurrentProjection(value: string, type: '30-day' | '1-year'): Promise<void> {
    const title = type === '30-day' ? '30-day projection' : '1-year projection'
    await expect(
      this.locateSavingsDAIPanel().getByRole('generic').filter({ hasText: title }).getByText(value),
    ).toBeVisible()
  }

  async expectPotentialProjection(value: string, type: '30-day' | '1-year'): Promise<void> {
    const title = type === '30-day' ? '30-day projection' : '1-year projection'
    await expect(
      this.locateSavingsOpportunityPanel().getByRole('generic').filter({ hasText: title }).getByText(value),
    ).toBeVisible()
  }

  async expectCashInWalletAssetBalance(assetName: string, value: string): Promise<void> {
    const panel = this.locateCashInWalletPanel()
    const row = panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }

  expectUpgradeDaiToNstButtonToBeHidden(): Promise<void> {
    return expect(this.locateUpgradeDaiToNstButton()).toBeHidden()
  }

  expectNstMoreDropdownToBeDisabled(): Promise<void> {
    return expect(this.locateNstMoreDropdown()).toBeDisabled()
  }

  async expectUpgradableDaiBalance(value: string): Promise<void> {
    const panel = this.locateCashInWalletPanel()
    const row = panel
      .getByRole('row')
      .filter({ has: this.page.getByTestId(testIds.savings.cashInWallet.upgradeDaiToNst) })
    await expect(row.getByRole('cell', { name: value })).toBeVisible()
  }
  // #endregion
}
