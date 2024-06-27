import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { NavbarPageObject } from '@/features/navbar/Navbar.PageObject'
import { DashboardPageObject } from '@/pages/Dashboard.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { ClaimRewardsDialogPageObject } from './ClaimRewardsDialog.PageObject'

test.describe('Claim rewards dialog', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })

  test('displays correct transaction overview', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-address',
        address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
      },
    })

    const navbar = new NavbarPageObject(page)
    await navbar.openClaimRewardsDialog()

    const claimRewardsDialog = new ClaimRewardsDialogPageObject(page)
    await claimRewardsDialog.expectRewards([
      {
        tokenSymbol: 'wstETH',
        amount: '6.42906',
        amountUSD: '~$16,850.36',
      },
    ])
  })

  test('has correct action plan', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-address',
        address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
      },
    })

    const navbar = new NavbarPageObject(page)
    await navbar.openClaimRewardsDialog()

    const claimRewardsDialog = new ClaimRewardsDialogPageObject(page)
    const actionsContainer = new ActionsPageObject(claimRewardsDialog.locatePanelByHeader('Actions'))

    await actionsContainer.expectActions([
      {
        type: 'claimRewards',
        asset: 'wstETH',
      },
    ])
  })

  test('executes transaction', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-address',
        address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
      },
    })

    const navbar = new NavbarPageObject(page)
    await navbar.openClaimRewardsDialog()

    const claimRewardsDialog = new ClaimRewardsDialogPageObject(page)
    const actionsContainer = new ActionsPageObject(claimRewardsDialog.locatePanelByHeader('Actions'))
    await actionsContainer.acceptAllActionsAction(1)

    await claimRewardsDialog.expectClaimRewardsSuccessPage([
      {
        tokenSymbol: 'wstETH',
        amount: '6.42906',
        amountUSD: '~$16,850.36',
      },
    ])

    const dashboard = new DashboardPageObject(page)
    await dashboard.goToDashboardAction()

    await dashboard.expectWalletTable({
      wstETH: 6.44807,
    })
  })
})
