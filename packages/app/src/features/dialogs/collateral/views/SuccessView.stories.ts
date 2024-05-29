import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/Dialogs/Views/Success',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl')],
  args: {
    token: tokens.ETH,
  },
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const DesktopCollateral: Story = {
  args: { collateralSetting: 'enabled' },
}

export const MobileCollateral = getMobileStory(DesktopCollateral)
export const TabletCollateral = getTabletStory(DesktopCollateral)
