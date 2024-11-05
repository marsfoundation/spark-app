import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { USDS_ACTIVATED_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { ConvertStablesDialogPageObject } from '../../ConvertStablesDialog.PageObject'

test.describe('Convert USDS to DAI', () => {
  const fork = setupFork({ blockNumber: USDS_ACTIVATED_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
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
    await convertStablesDialog.selectAssetOutAction('DAI')
    await convertStablesDialog.fillAmountInAction(10_000)
  })

  test('uses downgrade action', async () => {
    await convertStablesDialog.actionsContainer.expectEnabledActionAtIndex(0)
    await convertStablesDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDS' },
      { type: 'downgrade', fromToken: 'USDS', toToken: 'DAI' },
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
          tokenAmount: '10,000.00 DAI',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '10,000.00 DAI',
      outcomeUsd: '$10,000.00',
    })
  })

  test('executes conversion', async () => {
    await convertStablesDialog.actionsContainer.acceptAllActionsAction(2)
    await convertStablesDialog.expectSuccessPage()
    await convertStablesDialog.clickBackToSavingsButton()
    await savingsPage.expectStablecoinsInWalletAssetBalance('USDS', '-')
    await savingsPage.expectUpgradableDaiBalance('10,000.00')
  })
})
