import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import BigNumber from 'bignumber.js'
import { useForm } from 'react-hook-form'

import { BorrowView } from './BorrowView'

const meta: Meta<typeof BorrowView> = {
  title: 'Features/Dialogs/Views/Borrow',
  component: (args) => {
    const form = useForm() as any
    return <BorrowView {...args} form={form} />
  },
  decorators: [ZeroAllowanceWagmiDecorator(), WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    selectableAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
      },
      {
        token: tokens.ETH,
        balance: NormalizedUnitNumber(10),
      },
    ],
    assetsFields: {
      selectedAsset: {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(50000),
        value: '2000',
      },
      maxValue: NormalizedUnitNumber(5000),
      changeAsset: () => {},
    },
    objectives: [
      {
        type: 'borrow',
        token: tokens.DAI,
        value: NormalizedUnitNumber(2000),
      },
    ],
    borrowAsset: {
      token: tokens.DAI,
      value: NormalizedUnitNumber(2000),
    },
    pageStatus: {
      state: 'form',
      actionsEnabled: false,
      goToSuccessScreen: () => {},
    },
    currentHealthFactor: BigNumber(2.5),
    updatedHealthFactor: BigNumber(1.1),
    riskAcknowledgement: {
      onStatusChange: () => {},
      warning: { type: 'liquidation-warning-borrow' },
    },
  },
}

export default meta
type Story = StoryObj<typeof BorrowView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
