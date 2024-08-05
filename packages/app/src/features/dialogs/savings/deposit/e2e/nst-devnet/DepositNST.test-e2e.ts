import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { SavingsDialogPageObject } from '../../../common/e2e/SavingsDialog.PageObject'
import { Address, createPublicClient, erc20Abi, http } from 'viem'
import { waitFor } from '@testing-library/react'

test.describe('Deposit NST on NST DevNet', () => {
  const fork = setupFork({ chainId: NST_DEV_CHAIN_ID, simulationDateOverride: new Date('2024-08-05T10:43:19Z') })
  let savingsPage: SavingsPageObject
  let depositDialog: SavingsDialogPageObject
  let account: Address

  test.beforeEach(async ({ page }) => {
    ({ account } = await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected-random',
        assetBalances: {
          ETH: 1,
          NST: 10_000,
        },
      },
    }))

    savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('NST')

    depositDialog = new SavingsDialogPageObject({ page, type: 'deposit' })
    await depositDialog.fillAmountAction(10_000)
  })

  test('uses native sNST deposit', async () => {
    await depositDialog.actionsContainer.expectActions([
      { type: 'approve', asset: 'NST' },
      { type: 'makerStableToSavings', asset: 'NST', savingsAsset: 'sNST' },
    ])
  })

  test('displays transaction overview', async () => {
    await depositDialog.expectNativeRouteTransactionOverview({
      apy: {
        value: '5.00%',
        description: '~500.00 NST per year',
      },
      routeItems: [
        {
          tokenAmount: '10,000.00 NST',
          tokenUsdValue: '$10,000.00',
        },
        {
          tokenAmount: '9,896.42 sNST',
          tokenUsdValue: '$10,000.00',
        },
      ],
      outcome: '9,896.42 sNST worth $10,000.00',
      badgeToken: 'NST',
    })
  })

  test('executes deposit', async () => {
    const actionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(2, fork)

    await depositDialog.expectSuccessPage()
    await depositDialog.clickBackToSavingsButton()

    const publicClient = createPublicClient({
      transport: http(fork.forkUrl),
    })

    await waitFor(async () => {
      const balance = await publicClient.readContract({
        abi: erc20Abi,
        functionName: 'balanceOf',
        address: '0xea8ae08513f8230caa8d031d28cb4ac8ce720c68',
        args: [account],
      })
      console.log({
        type: 'Wait for balance',
        balance: balance.toString(),
        rpcUrl: fork.forkUrl,
      })
      if (balance.toString() !== '9896420000000000000000') {
        throw new Error('Balance not updated')
      }
    })

    await savingsPage.expectSavingsNSTBalance({ sNstBalance: '9,896.42 sNST', estimatedNstValue: '10,000' })
    await savingsPage.expectCashInWalletAssetBalance('NST', '-')
  })
})
