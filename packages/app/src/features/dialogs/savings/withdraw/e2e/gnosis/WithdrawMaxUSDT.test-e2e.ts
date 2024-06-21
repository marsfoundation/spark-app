import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw max USDT on Gnosis', () => {
  const fork = setupFork({
    blockNumber: 34575459n,
    chainId: gnosis.id,
    simulationDateOverride: new Date('2024-06-21T11:52:10Z'),
  })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          XDAI: 100,
          sDAI: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: 'max-sdai-to-usdt-gnosis',
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
        fee: '$21.76',
        slippage: '0.1%',
        finalToTokenAmount: '10,861.77 USDT',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectTransactionOverview([
      ['APY', '10.55%'],
      ['Exchange Rate', '1.00 XDAI 0.99806 USDT'],
      ['sDAI Balance', '10,000.00 sDAI 0.00 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectPotentialProjection('$95.02', '30-day')
    await savingsPage.expectPotentialProjection('$1,156.02', '1-year')
    await savingsPage.expectCashInWalletAssetBalance('USDT', '10,861.77')
  })
})
