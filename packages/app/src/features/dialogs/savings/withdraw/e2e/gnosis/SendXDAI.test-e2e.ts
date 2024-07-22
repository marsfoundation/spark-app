import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { GNOSIS_DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { getBalance } from '@/test/e2e/utils'
import { test } from '@playwright/test'
import { gnosis } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send XDAI on Gnosis', () => {
  const fork = setupFork({ blockNumber: GNOSIS_DEFAULT_BLOCK_NUMBER, chainId: gnosis.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  const amount = 7000

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          XDAI: 100,
          sDAI: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickSendButtonAction()

    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses native sDai withdraw and send', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'xDaiFromSDaiWithdraw', asset: 'XDAI', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '10.60%',
        description: '~741.86 XDAI per year',
      },
      routeItems: [
        {
          tokenAmount: '6,434.95 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 XDAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 XDAI worth $7,000.00',
      badgeToken: 'XDAI',
    })
  })

  test('executes send', async () => {
    const receiverBalanceBefore = await getBalance({ forkUrl: fork.forkUrl, address: receiver })
    const actionsContainer = new ActionsPageObject(sendDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2, fork)

    await sendDialog.expectSuccessPage()
    await sendDialog.expectReceiverBalance({
      forkUrl: fork.forkUrl,
      receiver,
      balanceBefore: receiverBalanceBefore,
      withdrawalAmount: amount,
    })
    await sendDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '3,565.05 sDAI', estimatedDaiValue: '3,878.094168' })
    await savingsPage.expectCashInWalletAssetBalance('XDAI', '100')
  })
})
