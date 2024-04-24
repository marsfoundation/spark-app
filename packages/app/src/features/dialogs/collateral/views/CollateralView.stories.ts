import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { CollateralView } from './CollateralView'

const meta: Meta<typeof CollateralView> = {
  title: 'Features/Dialogs/Views/Collateral',
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  component: CollateralView,
  args: {
    collateral: {
      token: tokens['ETH'],
      balance: NormalizedUnitNumber(10),
    },
    pageStatus: {
      state: 'form',
      actionsEnabled: true,
      goToSuccessScreen: () => {},
    },
  },
}

export default meta
type Story = StoryObj<typeof CollateralView>

export const Enable: Story = {
  args: {
    collateralSetting: 'enabled',
    currentHealthFactor: new BigNumber(1.5),
    updatedHealthFactor: new BigNumber(2.3),
    objectives: [
      {
        type: 'setUseAsCollateral',
        token: tokens['ETH'],
        useAsCollateral: true,
      },
    ],
  },
}

export const Disable: Story = {
  args: {
    collateralSetting: 'disabled',
    currentHealthFactor: new BigNumber(2.3),
    updatedHealthFactor: new BigNumber(1.5),
    objectives: [
      {
        type: 'setUseAsCollateral',
        token: tokens['ETH'],
        useAsCollateral: false,
      },
    ],
  },
}

export const DisableLiquidation: Story = {
  args: {
    collateralSetting: 'disabled',
    currentHealthFactor: new BigNumber(2.3),
    updatedHealthFactor: new BigNumber(0.5),
    objectives: [
      {
        type: 'setUseAsCollateral',
        token: tokens['ETH'],
        useAsCollateral: false,
      },
    ],
  },
}

export const Mobile = getMobileStory(Enable)
export const Tablet = getTabletStory(Enable)
