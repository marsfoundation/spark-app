import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send NST on Mainnet', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const nst = TOKENS_ON_FORK[NST_DEV_CHAIN_ID].NST

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

    await savingsPage.clickSendSNstButtonAction()
    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses native sNST withdraw and send', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'NST', savingsAsset: 'sNST', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,930.09 sNST',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 NST',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 NST worth $7,000.00',
      badgeToken: 'NST',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: nst,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(1, fork)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: nst,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsNSTBalance({ sNstBalance: '2,970.04 sNST', estimatedNstValue: '3,000' })
    await savingsPage.expectCashInWalletAssetBalance('NST', '-')
  })
})
