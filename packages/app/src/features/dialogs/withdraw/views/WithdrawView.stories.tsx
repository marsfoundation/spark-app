import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { chromatic } from '@storybook/viewports'
import BigNumber from 'bignumber.js'
import { useForm } from 'react-hook-form'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { getMockReserve } from '@/test/integration/constants'

import { WithdrawView } from './WithdrawView'

const meta: Meta<typeof WithdrawView> = {
  title: 'Features/Dialogs/Views/Withdraw',
  component: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm() as any
    return <WithdrawView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    withdrawOptions: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens.ETH,
        balance: NormalizedUnitNumber(10),
      },
    ],
    assetsToWithdrawFields: {
      selectedAsset: {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      changeAsset: () => {},
    },
    withdrawAsset: {
      token: tokens.DAI,
      value: NormalizedUnitNumber(2000),
    },
    objectives: [
      {
        type: 'withdraw',
        reserve: getMockReserve({
          token: tokens.DAI,
        }),
        value: NormalizedUnitNumber(2000),
        all: false,
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    currentPositionOverview: {
      healthFactor: BigNumber(4),
      tokenSupply: NormalizedUnitNumber(2000),
      supplyAPY: Percentage(0.04),
    },
    updatedPositionOverview: {
      healthFactor: BigNumber(2),
      tokenSupply: NormalizedUnitNumber(1000),
      supplyAPY: Percentage(0.04),
    },
  },
}

export default meta
type Story = StoryObj<typeof WithdrawView>

export const Desktop: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    chromatic: { viewports: [chromatic.mobile] },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    chromatic: { viewports: [chromatic.tablet] },
  },
}
