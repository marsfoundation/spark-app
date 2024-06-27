import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit USDC on Gnosis', () => {
  const fork = setupFork({
    blockNumber: 34575337n,
    chainId: gnosis.id,
    simulationDateOverride: new Date('2024-06-21T11:42:19Z'),
  })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-pkey',
        assetBalances: {
          XDAI: 100,
          USDT: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '10_000-usdt-to-sdai-gnosis',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses Lifi Swap', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDT' },
      {
        type: 'exchange',
        inputAsset: 'USDT',
        outputAsset: 'sDAI',
        fee: '$19.98',
        slippage: '0.1%',
        finalDAIAmount: '$9,979.26 DAI',
        finalToTokenAmount: '9,169.65 sDAI',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectTransactionOverview([
      ['APY', '10.55%'],
      ['Exchange Rate', '1.00 USDT 0.99793 XDAI'],
      ['sDAI Balance', '0.00 sDAI 9,169.65 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,169.65 sDAI', estimatedDaiValue: '9,979.26' })
    await savingsPage.expectCashInWalletAssetBalance('USDT', '-')
  })
})
