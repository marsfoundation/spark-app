import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { BASE_DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { base } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send USDS', () => {
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const usds = TOKENS_ON_FORK[base.id].USDS

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chain: base,
        blockNumber: BASE_DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sUSDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)

    await savingsPage.clickSendFromAccountButtonAction()
    sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('has correct action plan', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sUSDS' },
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,911.09 sUSDS',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 USDS',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 USDS',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      receiver,
      token: usds,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(2)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      receiver,
      token: usds,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsAccountBalance({ balance: '3,088.91', estimatedValue: '3,128.6548917' })
    await savingsPage.expectSupportedStablecoinBalance('USDS', '-')
  })
})
