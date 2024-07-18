import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Deposit USDC on Gnosis', () => {
  const fork = setupFork({
    blockNumber: 34572398n,
    chainId: gnosis.id,
    simulationDateOverride: new Date('2024-09-21T10:21:19Z'),
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
          USDC: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '10_000-usdc-to-sdai-gnosis',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDC')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses Lifi Swap', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'USDC' },
      {
        type: 'exchange',
        inputAsset: 'USDC',
        outputAsset: 'sDAI',
        fee: '$20.00',
        slippage: '0.1%',
        finalDAIAmount: '$9,980.72 DAI',
        finalToTokenAmount: '9,170.99 sDAI',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectTransactionOverview([
      ['APY', '10.55%'],
      ['Exchange Rate', '1.00 USDC 0.99807 XDAI'],
      ['sDAI Balance', '0.00 sDAI 9,170.99 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,170.99 sDAI', estimatedDaiValue: '9,980.71' })
    await savingsPage.expectCashInWalletAssetBalance('USDC', '-')
  })
})
