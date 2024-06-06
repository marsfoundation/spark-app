import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { SavingsPageObject } from '@/pages/Savings.PageObject'
import { LIFI_TEST_USER_PRIVATE_KEY, overrideLiFiRouteWithHAR } from '@/test/e2e/lifi'
import { setup } from '@/test/e2e/setup'
import { setupFork } from '@/test/e2e/setupFork'
import { test } from '@playwright/test'
import { mainnet } from 'viem/chains'
import { SavingsDepositDialogPageObject } from '../SavingsDepositDialog.PageObject'

test.describe('Deposit USDT on Mainnet', () => {
  const fork = setupFork({ blockNumber: 19990683n, chainId: mainnet.id })

  test('uses Lifi Swap', async ({ page }) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '10_000-usdt-to-sdai',
    })

    const savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    const depositDialog = new SavingsDepositDialogPageObject(page)
    await depositDialog.fillAmountAction(10_000)

    await depositDialog.expectToUseLifiSwap({
      title: 'Convert USDT to sDAI',
      fee: '$19.99',
      slippage: '0.1%',
      finalDAIAmount: '$9,978.30 DAI',
      finalSDAIAmount: '9,180.20 sDAI',
    })
  })

  test('displays transaction overview', async (page) => {
    await setup(page, fork, {
      initialPage: 'savings',
      account: {
        type: 'connected',
        assetBalances: {
          ETH: 1,
          USDT: 10_000,
        },
        privateKey: LIFI_TEST_USER_PRIVATE_KEY,
      },
    })
    await overrideLiFiRouteWithHAR({
      page,
      key: '10_000-usdt-to-sdai',
    })

    const savingsPage = new SavingsPageObject(page)
    await savingsPage.clickDepositButtonAction('USDT')

    const depositDialog = new SavingsDepositDialogPageObject(page)
    await depositDialog.fillAmountAction(10_000)

    await depositDialog.expectToUseLifiSwap({
      title: 'Convert USDT to sDAI',
      fee: '$19.99',
      slippage: '0.1%',
      finalDAIAmount: '$9,978.30 DAI',
      finalSDAIAmount: '9,180.20 sDAI',
    })
  })
})
