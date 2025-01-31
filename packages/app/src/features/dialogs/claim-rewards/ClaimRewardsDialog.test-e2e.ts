import { TopbarPageObject } from '@/features/topbar/Topbar.PageObject'
import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { ClaimRewardsDialogPageObject } from './ClaimRewardsDialog.PageObject'

test.describe('Claim rewards dialog', () => {
  let navbar: TopbarPageObject
  let claimRewardsDialog: ClaimRewardsDialogPageObject
  let testContext: TestContext<'connected-address'>

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: {
        blockNumber: DEFAULT_BLOCK_NUMBER,
        chain: mainnet,
      },
      initialPage: 'easyBorrow',
      account: {
        type: 'connected-address',
        address: '0xf8de75c7b95edb6f1e639751318f117663021cf0',
      },
    })

    navbar = new TopbarPageObject(testContext)
    await navbar.openClaimRewardsDialog()

    claimRewardsDialog = new ClaimRewardsDialogPageObject(testContext)
  })

  test('displays correct transaction overview', async () => {
    await claimRewardsDialog.expectRewards([
      {
        tokenSymbol: 'wstETH',
        amount: '6.3697',
        amountUSD: '$29,717.60',
      },
    ])
  })

  test('has correct action plan', async () => {
    await claimRewardsDialog.actionsContainer.expectActions([
      {
        type: 'claimMarketRewards',
        asset: 'wstETH',
      },
    ])
  })

  test('executes transaction', async () => {
    await claimRewardsDialog.actionsContainer.acceptAllActionsAction(1)

    await claimRewardsDialog.expectClaimRewardsSuccessPage([
      {
        tokenSymbol: 'wstETH',
        amount: '6.3697',
        amountUSD: '$29,717.60',
      },
    ])

    const myPortfolioPage = new MyPortfolioPageObject(testContext)
    await myPortfolioPage.goToMyPortfolioAction()

    await myPortfolioPage.expectBalancesInDepositTable({
      wstETH: 6.3697,
    })

    await navbar.expectRewardsBadgeNotVisible()
  })
})
