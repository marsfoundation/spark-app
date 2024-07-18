import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw USDT on Gnosis', () => {
  const fork = setupFork({
    blockNumber: 34575411n,
    chainId: gnosis.id,
    simulationDateOverride: new Date('2024-06-21T11:48:19Z'),
  })
  let savingsPage: SavingsPageObject
  let withdrawalDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          XDAI: 100,
          sDAI: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '1_000-usdt-from-sdai-gnosis',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDT')
    await withdrawalDialog.fillAmountAction(1000)
  })

  test('uses Lifi Swap', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      {
        type: 'exchange',
        inputAsset: 'sDAI',
        outputAsset: 'USDT',
        fee: '$2.01',
        slippage: '0.1%',
        finalToTokenAmount: '1,001.50 USDT',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectTransactionOverview([
      ['APY', '10.55%'],
      ['Exchange Rate', '1.00 XDAI 0.99806 USDT'],
      ['sDAI Balance', '10,000.00 sDAI 9,077.96 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,077.96 sDAI', estimatedDaiValue: '9,879.46' })
    await savingsPage.expectCashInWalletAssetBalance('USDT', '1,001.50')
  })
})
