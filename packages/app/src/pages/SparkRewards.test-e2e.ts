import { TestContext, setup } from '@/test/e2e/setup'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'

import { ClaimSparkRewardsDialogPageObject } from '@/features/dialogs/claim-spark-rewards/ClaimSparkRewardsDialog.PageObject'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { SparkRewardsPageObject } from './SparkRewards.PageObject'

test.describe('Spark Rewards', () => {
  let sparkRewardsPage: SparkRewardsPageObject
  let testContext: TestContext<'connected-random'>

  test.beforeEach(async ({ page }) => {
    testContext = await setup(page, {
      blockchain: { blockNumber: 21926420n, chain: mainnet },
      initialPage: 'sparkRewards',
      account: {
        type: 'connected-random',
        sparkRewards: [
          {
            rewardTokenSymbol: 'USDS',
            cumulativeAmount: NormalizedUnitNumber(101),
          },
        ],
      },
    })

    sparkRewardsPage = new SparkRewardsPageObject(testContext)
  })

  test('can claim', async () => {
    await sparkRewardsPage.clickClaimButton()
    await sparkRewardsPage.expectAmountToClaim('101.00')

    const claimDialog = new ClaimSparkRewardsDialogPageObject(testContext)

    await claimDialog.actionsContainer.acceptAllActionsAction(1)
    await claimDialog.clickCloseButtonAction()
    await sparkRewardsPage.expectAmountToClaim('0.00')
  })
})
