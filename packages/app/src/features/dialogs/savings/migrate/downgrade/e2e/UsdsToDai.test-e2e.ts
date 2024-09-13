import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { DowngradeDialogPageObject } from '../DowngradeDialog.PageObject'

test.describe('Downgrade USDS to DAI', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })

  test('downgrade to DAI is disabled when USDS balance is 0', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { USDS: 0 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectDowngradeToDaiToBeDisabled()
  })

  test('uses downgrade action', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { USDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.clickDowngradeUsdsToDaiOption()

    const downgradeDialog = new DowngradeDialogPageObject(page)
    await downgradeDialog.fillAmountAction(100)

    await downgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await downgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'downgrade', fromToken: 'USDS', toToken: 'DAI' },
    ])
  })

  test('executes transaction', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { USDS: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectStablecoinsInWalletAssetBalance('DAI', '-')
    await savingsPage.clickDowngradeUsdsToDaiOption()

    const downgradeDialog = new DowngradeDialogPageObject(page)
    await downgradeDialog.fillAmountAction(10_000)

    await downgradeDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await downgradeDialog.expectDowngradeSuccessPage({ token: 'USDS', amount: '10,000.00', usdValue: '$10,000.00' })
    await downgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectUpgradableDaiBalance('10,000.00')
  })
})
