import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { DowngradeDialogPageObject } from '../DowngradeDialog.PageObject'

test.describe('Downgrade NST to DAI', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID, simulationDateOverride: new Date('2024-08-05T10:43:19Z') })

  test('cannot open "more" dropdown when NST balance is 0', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { NST: 0 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectNstMoreDropdownToBeDisabled()
  })

  test('uses downgrade action', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { NST: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.clickDowngradeNstToDaiOption()

    const downgradeDialog = new DowngradeDialogPageObject(page)

    await downgradeDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await downgradeDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'NST' },
      { type: 'downgrade', fromToken: 'NST', toToken: 'DAI' },
    ])
  })

  test('executes transaction', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: { NST: 10_000 },
      },
    })

    const savingsPage = new SavingsPageObject(page)

    await savingsPage.expectCashInWalletAssetBalance('DAI', '-')
    await savingsPage.clickDowngradeNstToDaiOption()

    const downgradeDialog = new DowngradeDialogPageObject(page)

    await downgradeDialog.actionsContainer.acceptAllActionsAction(2)
    await downgradeDialog.expectDowngradeSuccessPage({ token: 'NST', amount: '10,000.00', usdValue: '$10,000.00' })
    await downgradeDialog.clickBackToSavingsButton()

    await savingsPage.expectUpgradableDaiBalance('10,000.00')
  })
})
