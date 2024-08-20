import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Withdraw NST from sNST', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          NST: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)

    await savingsPage.clickDepositButtonAction('NST')
    const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.clickWithdrawSNstButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawDialog.clickMaxAmountAction()
  })

  test('uses native sNST withdraw', async () => {
    await withdrawDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'NST', savingsAsset: 'sNST', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '9,900.13 sNST',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '10,000.00 NST',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '10,000.00 NST worth $10,000.00',
      badgeToken: 'NST',
    })

    await withdrawDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes withdraw', async () => {
    const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1, fork)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectPotentialProjection('$40.18', '30-day')
    await savingsPage.expectPotentialProjection('$500.00', '1-year')
    await savingsPage.expectCashInWalletAssetBalance('NST', '10,000')
  })
})

test.describe('Withdraw NST from sDAI', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let withdrawDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)

    await savingsPage.clickWithdrawSDaiButtonAction()
    withdrawDialog = new SavingsDialogPageObject({ page, type: 'withdraw' })
    await withdrawDialog.selectAssetAction('NST')
    await withdrawDialog.clickMaxAmountAction()
  })

  test('uses migrate sDAI to NST action', async () => {
    await withdrawDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'NST', savingsAsset: 'sDAI', mode: 'withdraw' },
    ])
  })

  test('displays transaction overview', async () => {
    await withdrawDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '10,000.00 sDAI',
          tokenUsdValue: '$11,047.93',
        },
        {
          tokenAmount: '11,047.93 DAI',
          tokenUsdValue: '$11,047.93',
        },
        {
          tokenAmount: '11,047.93 NST',
          tokenUsdValue: '$11,047.93',
        },
      ],
      outcome: '11,047.93 NST worth $11,047.93',
      badgeToken: 'NST',
    })

    await withdrawDialog.expectUpgradeSwitchToBeHidden()
  })

  test('executes withdraw', async () => {
    const actionsContainer = new ActionsPageObject(withdrawDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2, fork)

    await withdrawDialog.expectSuccessPage()
    await withdrawDialog.clickBackToSavingsButton()

    await savingsPage.expectCashInWalletAssetBalance('NST', '11,047.93')
    await savingsPage.expectPotentialProjection('$44.39', '30-day')
    await savingsPage.expectPotentialProjection('$552.40', '1-year')
  })
})
