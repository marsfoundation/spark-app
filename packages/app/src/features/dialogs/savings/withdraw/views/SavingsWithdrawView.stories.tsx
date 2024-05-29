import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { fakeBigInt } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { useForm } from 'react-hook-form'

import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { SavingsWithdrawView } from './SavingsWithdrawView'

const meta: Meta<typeof SavingsWithdrawView> = {
  title: 'Features/Dialogs/Views/Savings/Withdraw',
  component: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm() as any
    return <SavingsWithdrawView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    selectableAssets: [
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens.ETH,
        balance: NormalizedUnitNumber(1),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'exchange',
        swapParams: {
          fromToken: tokens.sDAI,
          toToken: tokens.USDC,
          type: 'reverse',
          value: NormalizedUnitNumber(5000),
          meta: {
            fee: Percentage(0),
            integratorKey: 'spark_waivefee',
            maxSlippage: Percentage(0.005),
          },
        },
        swapInfo: {
          status: 'success',
          data: {
            fromToken: tokens.sDAI.address,
            toToken: tokens.USDC.address,
            type: 'reverse',
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
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    riskAcknowledgement: {
      onStatusChange: () => {},
      warning: undefined,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsWithdrawView>

export const Desktop: Story = {}

export const Mobile: Story = getMobileStory(Desktop)

export const Tablet: Story = getTabletStory(Desktop)
