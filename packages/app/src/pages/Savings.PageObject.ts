import { Locator, Page, expect } from '@playwright/test'

import { BasePageObject } from '@/test/e2e/BasePageObject'
import { testIds } from '@/ui/utils/testIds'

export interface SavingsPageObjectOptions {
  usdsSupport: boolean
}

export class SavingsPageObject extends BasePageObject {
  private readonly usdsSupport: boolean

  constructor(pageOrLocator: Page | Locator, options: SavingsPageObjectOptions = { usdsSupport: false }) {
    super(pageOrLocator)
    this.usdsSupport = options.usdsSupport
  }

  // #region locators
  locateSavingsOpportunityPanel(): Locator {
    return this.locatePanelByHeader('Savings')
  }

  locateSavingsDaiPanel(): Locator {
    return this.locatePanelByHeader('Savings DAI')
  }

  locateUpgradeSDaiBanner(): Locator {
    return this.page.getByTestId(testIds.savings.upgradeSDaiBanner)
  }

  locateSavingsUsdsPanel(): Locator {
    return this.locatePanelByHeader('Savings USDS')
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
  // #endregion

  // #region actions
  async clickStartSavingButtonAction(): Promise<void> {
    await this.locateSavingsOpportunityPanel().getByRole('button', { name: 'Start saving' }).click()
  }

  async clickDepositButtonAction(assetName: string): Promise<void> {
    const panel = this.locatePanelByHeader('Stablecoins in wallet')
    const row = (() => {
      if (this.usdsSupport && assetName === 'DAI') {
        // DAI row has an upgrade button instead of the asset name when USDS is supported
        return panel
          .getByRole('row')
          .filter({ has: this.page.getByTestId(testIds.savings.stablecoinsInWallet.upgradeDaiToUsdsCell) })
      }

      return panel.getByRole('row').filter({ has: this.page.getByRole('cell', { name: assetName, exact: true }) })
    })()
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
      {
        timeout: 60_000, // potentially should wait a bit for balance to reach the value because of timing issues in e2e tests
      },
    )
    await expect(this.locatePanelByHeader('Savings DAI').getByTestId(testIds.savings.sDaiBalanceInDai)).toContainText(
      estimatedDaiValue,
      {
        timeout: 60_000,
      },
    )
  }

  async expectSavingsUSDSBalance({
    sUsdsBalance,
    estimatedUsdsValue,
  }: { sUsdsBalance: string; estimatedUsdsValue: string }): Promise<void> {
    await expect(this.locatePanelByHeader('Savings USDS').getByTestId(testIds.savings.sDaiBalance)).toHaveText(
      sUsdsBalance,
      {
        timeout: 60_000,
      },
    )
    await expect(this.locatePanelByHeader('Savings USDS').getByTestId(testIds.savings.sDaiBalanceInDai)).toContainText(
      estimatedUsdsValue,
      {
        timeout: 60_000,
      },
    )
  }

  async expectCurrentProjection(value: string, type: '30-day' | '1-year'): Promise<void> {
    const title = type === '30-day' ? '30-day projection' : '1-year projection'
    await expect(
      this.locateSavingsDaiPanel().getByRole('generic').filter({ hasText: title }).getByText(value),
    ).toBeVisible()
  }

  async expectPotentialProjection(value: string, type: '30-day' | '1-year'): Promise<void> {
    const title = type === '30-day' ? '30-day projection' : '1-year projection'
    await expect(
      this.locateSavingsOpportunityPanel().getByRole('generic').filter({ hasText: title }).getByText(value),
    ).toBeVisible()
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
