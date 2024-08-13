import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { PSM_ACTIONS_DEPLOYED, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send USDC on Mainnet', () => {
  const fork = setupFork({ blockNumber: PSM_ACTIONS_DEPLOYED, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const usdc = TOKENS_ON_FORK[mainnet.id].USDC

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
    await savingsPage.clickSendSDaiButtonAction()

    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.selectAssetAction('USDC')
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses native sDai withdraw and send', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'USDC', savingsAsset: 'sDAI', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,438.57 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 USDC',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 USDC worth $7,000.00',
      badgeToken: 'USDC',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usdc,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usdc,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsDAIBalance({ sDaiBalance: '3,561.43 sDAI', estimatedDaiValue: '3,871.98' })
    await savingsPage.expectCashInWalletAssetBalance('USDC', '-')
  })
})
