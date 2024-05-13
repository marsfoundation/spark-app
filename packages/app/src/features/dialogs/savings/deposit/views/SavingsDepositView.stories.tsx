import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { fakeBigInt } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'

import { SavingsDepositView } from './SavingsDepositView'

const meta: Meta<typeof SavingsDepositView> = {
  title: 'Features/Dialogs/Views/Savings/Deposit',
  component: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm() as any
    return <SavingsDepositView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    selectableAssets: [
      {
        token: tokens['USDC'],
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens['ETH'],
        balance: NormalizedUnitNumber(1),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens['USDC'],
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'exchange',
        swapParams: {
          fromToken: tokens['USDC'],
          toToken: tokens['sDAI'],
          type: 'direct',
          value: NormalizedUnitNumber(5000),
          maxSlippage: Percentage(0.005),
        },
        swapInfo: {
          status: 'success',
          data: {
            fromToken: tokens['USDC'].address,
            toToken: tokens['sDAI'].address,
            type: 'direct',
            txRequest: {
              data: '0x',
              from: '0x',
              gasLimit: fakeBigInt,
              gasPrice: fakeBigInt,
              to: '0x',
              value: fakeBigInt,
            },
            estimate: {
              feeCostsUSD: NormalizedUnitNumber(0),
              fromAmount: BaseUnitNumber(5000),
              toAmount: BaseUnitNumber(5000),
              toAmountMin: BaseUnitNumber(5000),
            },
          },
        },
      } satisfies ExchangeObjective,
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    txOverview: {
      DSR: Percentage(0.05),
      exchangeRatioToToken: tokens['DAI'],
      sDaiToken: tokens['sDAI'],
      exchangeRatioFromToken: tokens['USDC'],
      exchangeRatio: NormalizedUnitNumber(0.9996),
      sDaiBalanceBefore: NormalizedUnitNumber(5000),
      sDaiBalanceAfter: NormalizedUnitNumber(10000),
    },
    riskAcknowledgement: {
      acknowledged: false,
      isRiskAcknowledgedOrNotRequired: true,
      onStatusChange: () => {},
      text: undefined,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsDepositView>

export const Desktop: Story = {}

export const Mobile: Story = getMobileStory(Desktop)

export const Tablet: Story = getTabletStory(Desktop)
