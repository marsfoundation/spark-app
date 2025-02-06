import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_MOCK_SUSDC_ACTIVE_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { base } from 'viem/chains'

test.describe('Send USDC', () => {
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject

  const receiver = randomAddress('bob')
  const amount = 7000
  const usdc = TOKENS_ON_FORK[base.id].USDC

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: base,
        blockNumber: BASE_MOCK_SUSDC_ACTIVE_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDC: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('USDC')
    await savingsPage.clickDepositButtonAction('USDC')

    const depositDialog = new SavingsDialogPageObject({ testContext, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.actionsContainer.acceptAllActionsAction(2)
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.clickSendFromAccountButtonAction()
    sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })
    await sendDialog.selectAssetAction('USDC')
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('has correct action plan', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sUSDC', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,766.57 sUSDC',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 USDC',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 USDC',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      receiver,
      token: usdc,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(1)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      receiver,
      token: usdc,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsAccountBalance({ balance: '2,899.96', estimatedValue: '3,000.0001861' })
    await savingsPage.expectSupportedStablecoinBalance('USDC', '-')
  })
})
