import { SavingsDialogPageObject } from '@/features/dialogs/savings/common/e2e/SavingsDialog.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

test.describe('Send DAI', () => {
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const dai = TOKENS_ON_FORK[mainnet.id].DAI

  test.beforeEach(async ({ page }) => {
    const testContext = await setup(page, {
      blockchain: {
        chainId: mainnet.id,
        blockNumber: DEFAULT_BLOCK_NUMBER,
      },
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(testContext)
    await savingsPage.clickSavingsNavigationItemAction('DAI')
    await savingsPage.clickSendFromAccountButtonAction()

    sendDialog = new SavingsDialogPageObject({ testContext, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('has correct action plan', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'DAI', savingsAsset: 'sDAI', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,218.91 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 DAI',
      outcomeUsd: '$7,000.00',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      receiver,
      token: dai,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(1)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      receiver,
      token: dai,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsAccountBalance({ balance: '3,781.09', estimatedValue: '4,255.9918184' })
    await savingsPage.expectSupportedStablecoinBalance('DAI', '-')
  })
})
