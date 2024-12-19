import { repayValidationIssueToMessage } from '@/domain/market-validators/validateRepay'
import { tenderlyRpcActions } from '@/domain/tenderly/TenderlyRpcActions'
import { ActionsPageObject } from '@/features/actions/ActionsContainer.PageObject'
import { BorrowPageObject } from '@/pages/Borrow.PageObject'
import { MyPortfolioPageObject } from '@/pages/MyPortfolio.PageObject'
import { DEFAULT_BLOCK_NUMBER } from '@/test/e2e/constants'
import { setupFork } from '@/test/e2e/forking/setupFork'
import { injectFixedDate } from '@/test/e2e/injectSetup'
import { setup } from '@/test/e2e/setup'
import { BaseUnitNumber, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { Page, test } from '@playwright/test'
import { http, Address, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { DialogPageObject } from '../common/Dialog.PageObject'

const headerRegExp = /Repa*/

test.describe('Repay dialog', () => {
  const fork = setupFork({ blockNumber: DEFAULT_BLOCK_NUMBER, chainId: mainnet.id })
  const initialBalances = {
    wstETH: 100,
    rETH: 100,
    WETH: 100,
    DAI: 10000,
  }
  const expectedInitialHealthFactor = '5.65'
  const expectedHealthFactor = '5.82'

  test.describe('Position with borrowed DAI', () => {
    const initialDeposits = {
      rETH: 10,
    } as const
    const daiToBorrow = 3500

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
      await borrowPage.viewInMyPortfolioAction()

      const myPortfolioPage = new MyPortfolioPageObject(page)
      // @todo This waits for the refetch of the data after successful borrow transaction to happen.
      // This is no ideal, probably we need to refactor expectDepositTable so it takes advantage from
      // playwright's timeouts instead of parsing it's current state. Then we would be able to
      // easily wait for the table to be updated.
      await myPortfolioPage.expectAssetToBeInDepositTable('DAI')
    })

    test('opens dialog with selected asset', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('DAI')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.expectSelectedAsset('DAI')
      await repayDialog.expectDialogHeader('Repay DAI')
      await repayDialog.expectHealthFactorBeforeVisible()

      await screenshot(repayDialog.getDialog(), 'repay-dialog-default-view')
    })

    test('calculates health factor changes correctly when repaying part', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('DAI')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.fillAmountAction(100)

      await repayDialog.expectRiskLevelBefore('Healthy')
      await repayDialog.expectHealthFactorBefore(expectedInitialHealthFactor)
      await repayDialog.expectRiskLevelAfter('Healthy')
      await repayDialog.expectHealthFactorAfter(expectedHealthFactor)

      // @note this is needed for deterministic screenshots
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectEnabledActionAtIndex(0)

      await screenshot(repayDialog.getDialog(), 'repay-dialog-health-factor-partial-repay')
    })

    test('calculates health factor changes correctly when repaying all', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('DAI')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.clickMaxAmountAction()

      await repayDialog.expectRiskLevelBefore('Healthy')
      await repayDialog.expectHealthFactorBefore(expectedInitialHealthFactor)
      await repayDialog.expectRiskLevelAfter('No debt')
      await repayDialog.expectHealthFactorAfter(String.fromCharCode(0x221e))

      // @note this is needed for deterministic screenshots
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectEnabledActionAtIndex(0)

      await screenshot(repayDialog.getDialog(), 'repay-dialog-health-factor-full-repay')
    })

    test('after repay, health factor matches myPortfolio', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('DAI')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.fillAmountAction(100)

      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)

      await repayDialog.viewInMyPortfolioAction()
      await myPortfolioPage.expectHealthFactor(expectedHealthFactor)
    })

    test('has correct action plan for DAI', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction('DAI')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.fillAmountAction(100)
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions([
        { type: 'approve', asset: 'DAI' },
        { type: 'repay', asset: 'DAI' },
      ])
    })

    test('can repay DAI', async ({ page }) => {
      const repay = {
        asset: 'DAI',
        amount: 100,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.fillAmountAction(repay.amount)
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage([repay], fork)

      await screenshot(repayDialog.getDialog(), 'repay-dialog-dai-success')

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [repay.asset]: daiToBorrow - repay.amount,
      })
    })

    test('can fully repay DAI', async ({ page }) => {
      const repay = {
        asset: 'DAI',
        amount: 3500,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage([repay], fork)

      await screenshot(repayDialog.getDialog(), 'repay-dialog-dai-success')

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [repay.asset]: 0,
      })
    })

    // @todo: doesn't work properly because of fixed date or something
    test.skip('exact approvals are not required when repaying all', async ({ page }) => {
      const repay = {
        asset: 'DAI',
        amount: 3500,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      // (1) first approval with extra buffer
      await actionsContainer.acceptActionAtIndex(0)
      await actionsContainer.expectEnabledActionAtIndex(1)

      await page.reload()
      await myPortfolioPage.clickRepayButtonAction(repay.asset)
      await repayDialog.clickMaxAmountAction()

      // exact amount of debt slightly increased but approval (1) has a buffer so it should be enough
      // this should be rewrite to assert whole action plan and then accept
      // await actionsContainer.acceptActionAtIndex(1, { type: 'repay', asset: repay.asset })
      // await actionsContainer.acceptNextActionAction()

      await repayDialog.expectSuccessPage([repay], fork)
    })
  })

  test.describe('Position when borrowed asset was not in user wallet before', () => {
    const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const DAI_DECIMALS = 18

    const initialDeposits = {
      wstETH: 10,
    } as const

    const daiToBorrow = 10_000
    const daiDebtIncreaseIn1Epoch = 1.0000029476774694 // hardcoded for DAI borrow rate 5.53%
    const daiDebtIncreaseIn2Epochs = 1.0000058953636277 // hardcoded for DAI borrow rate 5.53%

    let account: Address
    let myPortfolioPage: MyPortfolioPageObject
    let repayDialog: DialogPageObject

    async function overrideDaiBalance({ balance, page }: { balance: BaseUnitNumber; page: Page }): Promise<void> {
      await tenderlyRpcActions.setTokenBalance(fork.forkUrl, DAI_ADDRESS, account, balance)
      await page.reload()
    }

    test.beforeEach(async ({ page }) => {
      ;({ account } = await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { wstETH: 10 },
        },
      }))

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositAssetsActions(initialDeposits, daiToBorrow)
      await borrowPage.viewInMyPortfolioAction()

      myPortfolioPage = new MyPortfolioPageObject(page)
      repayDialog = new DialogPageObject(page, headerRegExp)

      await myPortfolioPage.expectHealthFactor('2.08')

      // forcefully set browser time to the timestamp of borrow transaction
      const publicClient = createPublicClient({
        transport: http(fork.forkUrl),
      })
      const block = await publicClient.getBlock()
      await injectFixedDate(page, new Date(Number(block.timestamp) * 1000))
      await page.reload()
    })

    test('can repay if balance is less than debt', async ({ page }) => {
      const newBalance = 0.9 * daiToBorrow
      const repay = {
        asset: 'DAI',
        amount: newBalance,
      } as const

      await overrideDaiBalance({
        balance: BaseUnitNumber(NormalizedUnitNumber(newBalance).shiftedBy(DAI_DECIMALS)),
        page,
      })

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      await repayDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage([repay], fork)

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectNonZeroAmountInBorrowTable(repay.asset)
    })

    test('can repay if balance gt debt but lt debt after 1 epoch', async ({ page }) => {
      // The test asserts and edge case where user's balance is greater than debt, but less than debt after 1 epoch (30 minutes).
      // In this case the current implementation does not try to repay the debt including the interest accrued in the following time period
      // before the repay transaction is mined. Only the current debt is repaid. Therefore after the repay transaction some dust
      // (accrued interest) is left in the user's borrow table.
      const repay = {
        asset: 'DAI',
        amount: daiToBorrow,
      } as const

      const daiDebtIn1Epoch = NormalizedUnitNumber(daiToBorrow).times(daiDebtIncreaseIn1Epoch)
      // newBalance = (daiToBorrow, daiDebtIn1Epoch) / 2 - a number somewhere between daiToBorrow and daiDebtIn1Epoch
      const newBalance = BaseUnitNumber(daiDebtIn1Epoch.plus(daiToBorrow).div(2).shiftedBy(DAI_DECIMALS))
      await overrideDaiBalance({
        balance: newBalance,
        page,
      })

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      await repayDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage(
        [
          {
            asset: repay.asset,
            amount: daiToBorrow,
          },
        ],
        fork,
      )

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectNonZeroAmountInBorrowTable(repay.asset)
    })

    test('can repay if balance gt debt after 1 epoch but lt debt after 2 epochs', async ({ page }) => {
      const repay = {
        asset: 'DAI',
        amount: daiToBorrow,
      } as const

      const daiDebtIn1Epoch = NormalizedUnitNumber(daiToBorrow).times(daiDebtIncreaseIn1Epoch)
      const daiDebtIn2Epochs = NormalizedUnitNumber(daiToBorrow).times(daiDebtIncreaseIn2Epochs)
      // newBalance = (daiDebtIn1Epoch + daiDebtIn2Epochs) / 2 - a number somewhere between daiDebtIn1Epoch and daiDebtIn2Epochs
      const newBalance = BaseUnitNumber(daiDebtIn2Epochs.plus(daiDebtIn1Epoch).div(2).shiftedBy(DAI_DECIMALS))
      await overrideDaiBalance({
        balance: newBalance,
        page,
      })

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.clickMaxAmountAction()
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage(
        [
          {
            asset: repay.asset,
            amount: daiToBorrow,
          },
        ],
        fork,
      )

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [repay.asset]: 0,
      })
    })
  })

  test.describe('Position with multiple borrowed assets', () => {
    const initialDeposits = {
      wstETH: initialBalances.wstETH, // deposit whole balance
    } as const

    const wstETHBorrow = {
      asset: 'wstETH',
      amount: 10,
    }

    const WETHBorrow = {
      asset: 'WETH',
      amount: 10,
    }

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions(initialDeposits) // deposit whole wallet balance
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()

      // borrow wstETH and WETH
      const borrowDialog = new DialogPageObject(page, /Borrow */)
      const borrowActionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      // borrow wstETH
      await myPortfolioPage.clickBorrowButtonAction(wstETHBorrow.asset)
      await borrowDialog.fillAmountAction(wstETHBorrow.amount)
      await borrowActionsContainer.acceptAllActionsAction(1)
      await borrowDialog.viewInMyPortfolioAction()
      // borrow WETH
      await myPortfolioPage.clickBorrowButtonAction(WETHBorrow.asset)
      await borrowDialog.fillAmountAction(WETHBorrow.amount)
      await borrowActionsContainer.acceptAllActionsAction(1)
      await borrowDialog.viewInMyPortfolioAction()
    })

    test('can change asset to aToken', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('wstETH')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.selectAssetAction('awstETH')
      await repayDialog.expectSelectedAsset('awstETH')
      await repayDialog.expectDialogHeader('Repay wstETH')
      await repayDialog.expectHealthFactorBeforeVisible()
    })

    test('has correct action plan for repaying erc-20 using aToken', async ({ page }) => {
      const repay = {
        asset: 'awstETH',
        amount: 5,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('wstETH')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.selectAssetAction(repay.asset)
      await repayDialog.fillAmountAction(repay.amount)

      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions([{ type: 'repay', asset: repay.asset }])

      await screenshot(repayDialog.getDialog(), 'repay-dialog-erc20-atoken-action-plan')
    })

    test('can repay erc-20 using aToken', async ({ page }) => {
      const repay = {
        asset: 'awstETH',
        amount: 5,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction('wstETH')

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.selectAssetAction(repay.asset)
      await repayDialog.fillAmountAction(repay.amount)

      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(1)

      await screenshot(repayDialog.getDialog(), 'repay-dialog-erc20-atoken-success')

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        wstETH: wstETHBorrow.amount - repay.amount,
      })
    })

    test('has correct action plan for erc-20 repay with permits', async ({ page }) => {
      const repay = {
        asset: 'wstETH',
        amount: 5,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.fillAmountAction(repay.amount)
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.expectActions([
        { type: 'permit', asset: repay.asset },
        { type: 'repay', asset: repay.asset },
      ])

      await screenshot(repayDialog.getDialog(), 'repay-dialog-erc20-permit-action-plan')
    })

    test('has correct action plan for erc-20 repay with approves', async ({ page }) => {
      const repay = {
        asset: 'wstETH',
        amount: 5,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.switchPreferPermitsAction()

      await repayDialog.fillAmountAction(repay.amount)
      await actionsContainer.expectActions([
        { type: 'approve', asset: repay.asset },
        { type: 'repay', asset: repay.asset },
      ])

      await screenshot(repayDialog.getDialog(), 'repay-dialog-erc20-approve-action-plan')
    })

    test('can repay erc-20 using permits', async ({ page }) => {
      const repay = {
        asset: 'wstETH',
        amount: 5,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.fillAmountAction(repay.amount)
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage([repay], fork)

      await screenshot(repayDialog.getDialog(), 'repay-dialog-erc20-success')

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [repay.asset]: wstETHBorrow.amount - repay.amount,
      })
    })

    test('can repay erc-20 using approves', async ({ page }) => {
      const repay = {
        asset: 'wstETH',
        amount: 5,
      } as const

      const myPortfolioPage = new MyPortfolioPageObject(page)

      await myPortfolioPage.clickRepayButtonAction(repay.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      const actionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      await actionsContainer.switchPreferPermitsAction()
      await repayDialog.fillAmountAction(repay.amount)
      await actionsContainer.acceptAllActionsAction(2)
      await repayDialog.expectSuccessPage([repay], fork)

      await repayDialog.viewInMyPortfolioAction()

      await myPortfolioPage.expectBorrowTable({
        [repay.asset]: wstETHBorrow.amount - repay.amount,
      })
    })
  })

  test.describe('Form validation', () => {
    const initialDeposits = {
      wstETH: initialBalances.wstETH, // deposit whole balance
    } as const

    const wstETHBorrow = {
      asset: 'wstETH',
      amount: 50,
    }

    const wstETHDeposit = {
      asset: 'wstETH',
      amount: 50,
    }

    const WETHBorrow = {
      asset: 'WETH',
      amount: 10,
    }

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions(initialDeposits) // deposit whole wallet balance
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()

      // borrow wstETH and WETH
      const borrowDialog = new DialogPageObject(page, /Borrow */)
      const borrowActionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      // borrow wstETH
      await myPortfolioPage.clickBorrowButtonAction(wstETHBorrow.asset)
      await borrowDialog.fillAmountAction(wstETHBorrow.amount)
      await borrowActionsContainer.acceptAllActionsAction(1)
      await borrowDialog.viewInMyPortfolioAction()
      // borrow WETH
      await myPortfolioPage.clickBorrowButtonAction(WETHBorrow.asset)
      await borrowDialog.fillAmountAction(WETHBorrow.amount)
      await borrowDialog.clickAcknowledgeRisk()
      await borrowActionsContainer.acceptAllActionsAction(1)
      await borrowDialog.viewInMyPortfolioAction()

      // deposit wstETH to have balance not enough to later repay debt using wstETH
      const depositDialog = new DialogPageObject(page, /Deposit */)
      const depositActionsContainer = new ActionsPageObject(depositDialog.locatePanelByHeader('Actions'))
      await myPortfolioPage.clickDepositButtonAction(wstETHDeposit.asset)
      await depositDialog.fillAmountAction(wstETHDeposit.amount)
      await depositActionsContainer.acceptAllActionsAction(2)
      await depositDialog.viewInMyPortfolioAction()
    })

    test('cannot repay repay more than owe', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction(WETHBorrow.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.expectHealthFactorBefore('2.03')
      await repayDialog.fillAmountAction(WETHBorrow.amount + 1)
      await repayDialog.expectAssetInputError(repayValidationIssueToMessage['exceeds-debt'])

      await screenshot(repayDialog.getDialog(), 'repay-dialog-more-than-owe')
    })

    test('cannot repay more than wallet balance', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickRepayButtonAction(wstETHBorrow.asset)

      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.expectHealthFactorBefore('2.03')
      await repayDialog.fillAmountAction(1)
      await repayDialog.expectAssetInputError(repayValidationIssueToMessage['exceeds-balance'])

      await screenshot(repayDialog.getDialog(), 'repay-dialog-more-than-balance')
    })
  })

  // @note Add tests when problem with native asset deposit is solved
  test.describe('Position with native token debt', () => {})

  test.describe('Position with only deposit', () => {
    const initialDeposits = {
      wstETH: 10,
    } as const

    test.beforeEach(async ({ page }) => {
      await setup(page, fork, {
        initialPage: 'easyBorrow',
        account: {
          type: 'connected-random',
          assetBalances: { ...initialBalances },
        },
      })

      const borrowPage = new BorrowPageObject(page)
      await borrowPage.depositWithoutBorrowActions(initialDeposits)
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.goToMyPortfolioAction()
    })

    test('nothing to repay', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.expectBorrowedAssetsToBeEmpty()
      await screenshot(page, 'repay-dialog-nothing-to-repay')
    })

    test('when repaying native asset retain some in wallet', async ({ page }) => {
      const myPortfolioPage = new MyPortfolioPageObject(page)
      await myPortfolioPage.clickBorrowButtonAction('WETH')

      const borrowDialog = new DialogPageObject(page, /Borrow */)
      await borrowDialog.selectAssetAction('ETH')
      await borrowDialog.fillAmountAction(5)
      const borrowActionsContainer = new ActionsPageObject(borrowDialog.locatePanelByHeader('Actions'))
      await borrowActionsContainer.acceptAllActionsAction(2)
      await borrowDialog.viewInMyPortfolioAction()
      await myPortfolioPage.expectBorrowTable({ WETH: 5 })

      await myPortfolioPage.clickRepayButtonAction('WETH')
      const repayDialog = new DialogPageObject(page, headerRegExp)
      await repayDialog.selectAssetAction('ETH')
      const repayActionsContainer = new ActionsPageObject(repayDialog.locatePanelByHeader('Actions'))
      // wait for select to switch to ETH
      await repayActionsContainer.expectActions([
        {
          type: 'repay',
          asset: 'ETH',
        },
      ])
      await repayDialog.clickMaxAmountAction()

      await repayDialog.expectInputValue('4.999')
    })
  })
})
