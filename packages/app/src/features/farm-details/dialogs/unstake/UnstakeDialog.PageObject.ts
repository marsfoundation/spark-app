import { DialogPageObject } from '@/features/dialogs/common/Dialog.PageObject'
import { testIds } from '@/ui/utils/testIds'
import { Page, expect } from '@playwright/test'

export class UnstakeDialogPageObject extends DialogPageObject {
  constructor(page: Page) {
    super(page, /Withdraw/)
  }

  // #region actions
  async clickBackToFarmAction(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to Farm' }).click()
    await this.region.waitFor({
      state: 'detached',
    })
  }

  async clickExitFarmSwitchAction(): Promise<void> {
    await this.page.getByTestId(testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.switch).click()
  }
  //

  // #region assertions
  async expectExitFarmSwitchToBeHidden(): Promise<void> {
    await expect(this.page.getByTestId(testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.switch)).toBeHidden()
  }

  async expectExitFarmSwitchToBeVisible(): Promise<void> {
    await expect(this.page.getByTestId(testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.switch)).toBeVisible()
  }

  async expectExitFarmSwitchNotChecked(): Promise<void> {
    await expect(this.page.getByTestId(testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.switch)).not.toBeChecked()
  }

  async expectExitFarmSwitchReward({ min, max, token, usdValue }: Reward): Promise<void> {
    const regexp = /~([\d,\.]+) (\w+) \(~\$([\d,\.]+)\)/
    const rewardRowText = await this.page
      .getByTestId(testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.reward)
      .textContent()

    const match = rewardRowText?.match(regexp)
    expect(match).toBeDefined()

    const [rewardAmount, rewardToken, rewardUsdValue] = match!.slice(1)
    const rewardNumber = Number(rewardAmount?.replace(/,/g, ''))
    expect(rewardNumber).toBeGreaterThanOrEqual(min)
    expect(rewardNumber).toBeLessThanOrEqual(max)
    expect(rewardToken).toBe(token)
    expect(rewardUsdValue).toContain(usdValue)
  }

  async expectRoutesOverview(route: Route): Promise<void> {
    const routeItemTestIds = testIds.dialog.transactionOverview.routeItem
    const txOverviewTestIds = testIds.farmDetails.unstakeDialog.transactionOverview

    for (let i = 0; i < route.swaps.length; i++) {
      await expect(this.page.getByTestId(routeItemTestIds.tokenWithAmount(i))).toContainText(
        route.swaps[i]!.tokenAmount,
      )
      await expect(this.page.getByTestId(routeItemTestIds.tokenUsdValue(i))).toContainText(
        route.swaps[i]!.tokenUsdValue,
      )
    }

    await expect(this.page.getByTestId(txOverviewTestIds.route.farm.farmName)).toContainText(route.farm.upperText)
    await expect(this.page.getByTestId(txOverviewTestIds.route.farm.stakingToken)).toContainText(route.farm.lowerText)
  }

  async expectTransactionOverview({ route, outcome }: TransactionOverview): Promise<void> {
    await this.expectRoutesOverview(route)
    await expect(this.page.getByTestId(testIds.farmDetails.unstakeDialog.transactionOverview.outcome)).toContainText(
      outcome,
    )
  }

  async expectExitTransactionOverview({ route, reward, outcome }: ExitTransactionOverview): Promise<void> {
    await this.expectRoutesOverview(route)

    const regexp = /([\d,\.]+) (\w+) \(\$([\d,\.]+)\) \+ ~([\d,\.]+) (\w+) \(~\$([\d,\.]+)\)/
    const rewardRowText = await this.page
      .getByTestId(testIds.farmDetails.unstakeDialog.transactionOverview.outcome)
      .textContent()

    const match = rewardRowText?.match(regexp)
    expect(match).toBeDefined()

    const [outcomeAmount, outcomeToken, outcomeUsdValue, rewardAmount, rewardToken, rewardUsdValue] = match!.slice(1)
    expect(outcomeAmount).toBe(outcome.amount)
    expect(outcomeToken).toBe(outcome.token)
    expect(outcomeUsdValue).toBe(outcome.usdValue)
    const rewardNumber = Number(rewardAmount?.replace(/,/g, ''))
    expect(rewardNumber).toBeGreaterThanOrEqual(reward.min)
    expect(rewardNumber).toBeLessThanOrEqual(reward.max)
    expect(rewardToken).toBe(reward.token)
    expect(rewardUsdValue).toContain(reward.usdValue)
  }

  async expectSuccessPage(): Promise<void> {
    // for now we only check if the success message is visible
    await expect(this.page.getByText('Congrats, all done!')).toBeVisible()
  }
  // #endregion
}

export interface Reward {
  min: number
  max: number
  token: string
  usdValue: string
}

export interface Outome {
  amount: string
  token: string
  usdValue: string
}

export interface Route {
  swaps: {
    tokenAmount: string
    tokenUsdValue: string
  }[]
  farm: {
    upperText: string
    lowerText: string
  }
}

export interface TransactionOverview {
  route: Route
  outcome: string
}

export interface ExitTransactionOverview {
  route: Route
  reward: Reward
  outcome: Outome
}
