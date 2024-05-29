import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { chromatic } from '@storybook/viewports'
import BigNumber from 'bignumber.js'
import { useForm } from 'react-hook-form'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { RepayView } from './RepayView'

const meta: Meta<typeof RepayView> = {
  title: 'Features/Dialogs/Views/Repay',
  component: (args) => {
    
    const form = useForm() as any
    return <RepayView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    debtAsset: tokens.DAI,
    repayOptions: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens.ETH,
        balance: NormalizedUnitNumber(10),
      },
    ],
    assetsToRepayFields: {
      selectedAsset: {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      changeAsset: () => {},
    },
    objectives: [],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    currentPositionOverview: {
      healthFactor: BigNumber(4),
      debt: NormalizedUnitNumber(5000),
    },
    updatedPositionOverview: {
      healthFactor: BigNumber(2),
      debt: NormalizedUnitNumber(2000),
    },
  },
}

export default meta
type Story = StoryObj<typeof RepayView>

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
