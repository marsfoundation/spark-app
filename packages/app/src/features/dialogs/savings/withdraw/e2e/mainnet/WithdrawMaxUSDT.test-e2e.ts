import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe.skip('Withdraw max USDT on Mainnet', () => {
  const fork = setupFork({
    blockNumber: 20138171n,
    chainId: mainnet.id,
    simulationDateOverride: new Date('2024-06-21T08:34:00Z'),
  })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: 'max-sdai-to-usdt',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDT')
    await withdrawalDialog.clickMaxAmountAction()
  })

  test('uses Lifi Swap', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      {
        type: 'exchange',
        inputAsset: 'sDAI',
        outputAsset: 'USDT',
        fee: '$21.81',
        slippage: '0.1%',
        finalToTokenAmount: '10,892.38 USDT',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectTransactionOverview([
      ['APY', '8.00%'],
      ['Exchange Rate', '1.00 DAI 0.99855 USDT'],
      ['sDAI Balance', '10,000.00 sDAI 0.00 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectPotentialProjection('$69.12', '30-day')
    await savingsPage.expectPotentialProjection('$871.39', '1-year')
    await savingsPage.expectCashInWalletAssetBalance('USDT', '10,892.38')
  })
})
