import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { base } from 'viem/chains'
import { ConvertStablesDialogPageObject } from '../../ConvertStablesDialog.PageObject'

test.describe('Convert USDS to USDC', () => {
  const fork = setupFork({ chainId: base.id, blockNumber: 22143788n, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let convertStablesDialog: ConvertStablesDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickConvertStablesButtonAction()

    convertStablesDialog = new ConvertStablesDialogPageObject(page)
    await convertStablesDialog.selectAssetInAction('USDS')
    await convertStablesDialog.selectAssetOutAction('USDC')
    await convertStablesDialog.fillAmountInAction(10_000)
  })

  test('uses psm convert action', async () => {
    await convertStablesDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await convertStablesDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'psmConvert', inToken: 'USDS', outToken: 'USDC' },
    ])
  })

  test('displays transaction overview', async () => {
    await convertStablesDialog.expectTransactionOverview({
      routeItems: [
        {
          tokenAmount: '10,000.00 USDS',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 USDC',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '10,000.00 USDC',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes conversion', async () => {
    await convertStablesDialog.actionsContainer.acceptAllActionsAction(2)
    await convertStablesDialog.expectSuccessPage()
    await convertStablesDialog.clickBackToSavingsButton()
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '-')
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDC', '10,000.00')
  })
})
