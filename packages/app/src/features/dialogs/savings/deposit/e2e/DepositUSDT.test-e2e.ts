import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDepositDialogPageObject } from '../SavingsDepositDialog.PageObject'

test.describe('Deposit USDT on Mainnet', () => {
  const fork = setupFork({ blockNumber: 19990683n, chainId: mainnet.id })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDepositDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '10_000-usdt-to-sdai',
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    depositDialog = new SavingsDepositDialogPageObject(page)
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses Lifi Swap', async ({ page }) => {
    await depositDialog.expectToUseLifiSwap({
      title: 'Convert USDT to sDAI',
      fee: '$19.99',
      slippage: '0.1%',
      finalDAIAmount: '$9,978.30 DAI',
      finalSDAIAmount: '9,180.20 sDAI',
    })
  })

  test('displays transaction overview', async ({ page }) => {
    await depositDialog.expectTransactionOverview([
      ['APY', '8.00%'],
      ['Exchange Rate', '1.00 USDT 0.99783 DAI'],
      ['sDAI Balance', '0.00 sDAI 9,180.20 sDAI'],
    ])
  })

  test('executes swap', async ({ page }) => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '9,177.31 sDAI', estimatedDaiValue: '9,975' })
  })
})
