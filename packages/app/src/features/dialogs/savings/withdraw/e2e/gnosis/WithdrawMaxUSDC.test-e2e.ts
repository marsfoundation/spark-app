import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw max USDC on Gnosis', () => {
  const fork = setupFork({
    blockNumber: 34572740n,
    chainId: gnosis.id,
    simulationDateOverride: new Date('2024-09-21T10:21:19Z'),
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
      key: 'max-sdai-to-usdc-gnosis',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickWithdrawButtonAction()

    withdrawalDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawalDialog.selectAssetAction('USDC')
    await withdrawalDialog.clickMaxAmountAction()
  })

  test('uses Lifi Swap', async () => {
    await withdrawalDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      {
        type: 'exchange',
        inputAsset: 'sDAI',
        outputAsset: 'USDC',
        fee: '$21.76',
        slippage: '0.1%',
        finalToTokenAmount: '10,857.99 USDC',
      },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawalDialog.expectTransactionOverview([
      ['APY', '10.55%'],
      ['Exchange Rate', '1.00 XDAI 0.99771 USDC'],
      ['sDAI Balance', '10,000.00 sDAI 0.00 sDAI'],
    ])
  })

  test('executes swap', async () => {
    const actionsContainer = new ActionsPageObject(withdrawalDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await withdrawalDialog.expectSuccessPage()
    await withdrawalDialog.clickBackToSavingsButton()

    await savingsPage.expectPotentialProjection('$94.99', '30-day')
    await savingsPage.expectPotentialProjection('$1,155.67', '1-year')
    await savingsPage.expectCashInWalletAssetBalance('USDC', '10,857.99')
  })
})
