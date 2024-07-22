import { receiverValidationIssueToMessage } from '@/domain/savings/validateReceiver'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { DEFAULT_BLOCK_NUMBER, TOKENS_ON_FORK } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { getTokenBalance } from '@/test/e2e/utils'
import { test } from '@playwright/test'
import { Address, zeroAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { withdrawValidationIssueToMessage } from '../../logic/validation'

test.describe('Send DAI on Mainnet', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  const amount = 7000
  const dai = TOKENS_ON_FORK[mainnet.id].DAI

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
    await savingsPage.clickSendButtonAction()

    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.fillAmountAction(amount)
    await sendDialog.fillReceiverAction(receiver)
  })

  test('uses native sDai withdraw and send', async () => {
    await sendDialog.actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' }])
  })

  test('displays transaction overview', async () => {
    await sendDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '5.00%',
        description: '~350.00 DAI per year',
      },
      routeItems: [
        {
          tokenAmount: '6,647.10 sDAI',
          tokenUsdValue: '$7,000.00',
        },
        {
          tokenAmount: '7,000.00 DAI',
          tokenUsdValue: '$7,000.00',
        },
      ],
      outcome: '7,000.00 DAI worth $7,000.00',
      badgeToken: 'DAI',
    })
  })

  test('executes send', async () => {
    const receiverDaiBalanceBefore = await getTokenBalance({ forkUrl: fork.forkUrl, address: receiver, token: dai })
    const actionsContainer = new ActionsPageObject(sendDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1, fork)

    await sendDialog.expectSuccessPage()
    await sendDialog.expectReceiverBalance({
      forkUrl: fork.forkUrl,
      receiver,
      token: dai,
      balanceBefore: receiverDaiBalanceBefore,
      withdrawalAmount: amount,
    })
    await sendDialog.clickBackToSavingsButton()

    await savingsPage.expectSavingsBalance({ sDaiBalance: '3,352.90 sDAI', estimatedDaiValue: '3,530.91' })
    await savingsPage.expectCashInWalletAssetBalance('DAI', '-')
  })
})

test.describe('Asset input validation', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  const receiver = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

  test.describe('Input value exceeds sDAI value', () => {
    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            sDAI: 100,
          },
        },
      })

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickSendButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
      await sendDialog.fillAmountAction(200)
      await sendDialog.fillReceiverAction(receiver)
    })

    test('displays validation error', async () => {
      await sendDialog.expectAssetInputError(withdrawValidationIssueToMessage['exceeds-balance'])
    })

    test('actions are disabled', async () => {
      await sendDialog.actionsContainer.expectDisabledActions([
        { type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' },
      ])
    })

    test('displays sensible tx overview', async () => {
      await sendDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '5.00%',
          description: '~10.00 DAI per year',
        },
        routeItems: [
          {
            tokenAmount: '189.92 sDAI',
            tokenUsdValue: '$200.00',
          },
          {
            tokenAmount: '200.00 DAI',
            tokenUsdValue: '$200.00',
          },
        ],
        outcome: '200.00 DAI worth $200.00',
        badgeToken: 'DAI',
      })
    })
  })

  test('displays validation error for dirty input with 0 value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickSendButtonAction()
    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })

    await sendDialog.fillAmountAction(10)
    await sendDialog.fillAmountAction(0)

    await sendDialog.expectAssetInputError(withdrawValidationIssueToMessage['value-not-positive'])
  })
})

test.describe('Receiver input validation', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject
  let selfAddress: Address

  test.describe('Incorrect receiver address', () => {
    test.beforeEach(async ({ page }) => {
      const { account } = await setup(page, fork, {
        initialPage: 'savings',
        account: {
          type: 'connected-random',
          assetBalances: {
            ETH: 1,
            sDAI: 100,
          },
        },
      })

      selfAddress = account

      savingsPage = new SavingsPageObject(page)
      await savingsPage.clickSendButtonAction()

      sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
      await sendDialog.fillAmountAction(50) // valid input amount
    })

    test('displays validation error', async () => {
      // invalid address is not valid
      await sendDialog.fillReceiverAction('0x0')
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['invalid-address'])
      await sendDialog.fillReceiverAction('not-an-address')
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['invalid-address'])
      await sendDialog.fillReceiverAction('0XD8DA6BF26964AF9D7EED9E03E53415D37AA96045') // uppercase
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['invalid-address'])

      // zero address is not valid
      await sendDialog.fillReceiverAction(zeroAddress)
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['zero-address'])

      // reserve address is not valid
      await sendDialog.fillReceiverAction('0x6B175474E89094C44Da98b954EedeAC495271d0F') // dai
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['reserve-address'])

      // self address is not valid
      await sendDialog.fillReceiverAction(selfAddress)
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['self-address'])

      // empty address is not valid
      await sendDialog.fillReceiverAction('')
      await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['undefined-receiver'])
    })

    test('actions are disabled when receiver input is invalid', async () => {
      await sendDialog.fillReceiverAction('not-an-address')
      await sendDialog.actionsContainer.expectDisabledActions([
        { type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' },
      ])
    })

    test('displays sensible tx overview when amount is provided and receiver is invalid', async () => {
      await sendDialog.fillReceiverAction('not-an-address')
      await sendDialog.expectNativeRouteTransactionOverview({
        apy: {
          value: '5.00%',
          description: '~2.50 DAI per year',
        },
        routeItems: [
          {
            tokenAmount: '47.48 sDAI',
            tokenUsdValue: '$50.00',
          },
          {
            tokenAmount: '50.00 DAI',
            tokenUsdValue: '$50.00',
          },
        ],
        outcome: '50.00 DAI worth $50.00',
        badgeToken: 'DAI',
      })
    })
  })

  test('displays validation error for dirty input with no value', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickSendButtonAction()
    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
    await sendDialog.fillAmountAction(10)

    await sendDialog.fillReceiverAction('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    await sendDialog.fillReceiverAction('')
    await sendDialog.expectAddressInputError(receiverValidationIssueToMessage['undefined-receiver'])
  })
})

test.describe('Form validation', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id, useTenderlyVnet: true })
  let savingsPage: SavingsPageObject
  let sendDialog: SavingsDialogPageObject

  test.beforeEach(async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          sDAI: 100,
        },
      },
    })

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickSendButtonAction()

    sendDialog = new SavingsDialogPageObject({ page, type: 'send' })
  })

  test('actions are disabled when amount is invalid, but receiver is valid', async () => {
    await sendDialog.fillAmountAction(200)
    await sendDialog.fillReceiverAction('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    await sendDialog.actionsContainer.expectDisabledActions([
      { type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' },
    ])
  })

  test('actions are disabled when amount is valid, but receiver is invalid', async () => {
    await sendDialog.fillAmountAction(50)
    await sendDialog.fillReceiverAction('not-an-address')
    await sendDialog.actionsContainer.expectDisabledActions([
      { type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' },
    ])
  })

  test('actions are disabled when both amount and receiver are invalid', async () => {
    await sendDialog.fillAmountAction(200)
    await sendDialog.fillReceiverAction('not-an-address')
    await sendDialog.actionsContainer.expectDisabledActions([
      { type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' },
    ])
  })

  test('actions are enabled when amount and receiver are valid', async () => {
    await sendDialog.fillAmountAction(50)
    await sendDialog.fillReceiverAction('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    await sendDialog.actionsContainer.expectActions([{ type: 'daiFromSDaiWithdraw', asset: 'DAI', mode: 'send' }])
  })
})
