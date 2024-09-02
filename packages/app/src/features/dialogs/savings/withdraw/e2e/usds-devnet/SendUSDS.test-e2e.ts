import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { randomAddress } from '@/test/utils/addressUtils'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'

test.describe('Send USDS (withdrawing from sUSDS)', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const usds = TOKENS_ON_FORK[USDS_DEV_CHAIN_ID].USDS

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          USDS: 10_000,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)

    await savingsPage.clickDepositButtonAction('USDS')
    const depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
    await depositDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await depositDialog.clickBackToSavingsButton()

    await savingsPage.clickSendSUsdsButtonAction()
    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses native sUSDS withdraw and send', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sUSDS', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,998.31 sUSDS',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 USDS',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 USDS worth $7,000.00',
      badgeToken: 'USDS',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usds,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(1, fork)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usds,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsUSDSBalance({ sUsdsBalance: '2,999.28 sUSDS', estimatedUsdsValue: '3,000' })
    await savingsPage.expectCashInWalletAssetBalance('USDS', '-')
  })
})

test.describe('Send USDS (withdrawing from sDAI)', () => {
  const fork = setupFork({ chainId: USDS_DEV_CHAIN_ID })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = randomAddress('bob')
  const amount = 7000
  const usds = TOKENS_ON_FORK[USDS_DEV_CHAIN_ID].USDS

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
    await sendDialog.selectAssetAction('USDS')
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses migrate sDAI to USDS action', async () => {
    await sendDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'sDAI' },
      { type: 'withdrawFromSavings', asset: 'USDS', savingsAsset: 'sDAI', mode: 'send' },
    ])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      routeItems: [
        {
          tokenAmount: '6,332.77 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 USDS',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 USDS worth $7,000.00',
      badgeToken: 'USDS',
    })
  })

  test('executes send', async () => {
    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usds,
      expectedBalance: 0,
    })

    await sendDialog.actionsContainer.acceptAllActionsAction(2, fork)
    await sendDialog.expectSuccessPage()

    await sendDialog.expectReceiverTokenBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: usds,
      expectedBalance: amount,
    })

    await sendDialog.clickBackToSavingsButton()
    await savingsPage.expectSavingsDAIBalance({ sDaiBalance: '3,667.23 sDAI', estimatedDaiValue: '4,053.60' })
    await savingsPage.expectCashInWalletAssetBalance('USDS', '-')
  })
})
