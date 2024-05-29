import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { chromatic } from '@storybook/viewports'
import BigNumber from 'bignumber.js'
import { useForm } from 'react-hook-form'
import { zeroAddress } from 'viem'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { DepositView } from './DepositView'

const meta: Meta<typeof DepositView> = {
  title: 'Features/Dialogs/Views/Deposit',
  component: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm() as any
    return <DepositView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    initialToken: tokens.USDC,
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
        type: 'deposit',
        token: tokens.USDC,
        value: NormalizedUnitNumber(50000),
        lendingPool: CheckedAddress(zeroAddress),
      },
    ],
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
    currentPositionOverview: {
      healthFactor: new BigNumber(1.5),
      collateralization: 'enabled',
      supplyAPY: Percentage(0.04),
    },
    updatedPositionOverview: {
      healthFactor: new BigNumber(2.3),
      collateralization: 'enabled',
      supplyAPY: Percentage(0.04),
    },
  },
}

export default meta
type Story = StoryObj<typeof DepositView>

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
