import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/Dialogs/Views/Success',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl')],
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const DesktopEMode: Story = {
  name: 'Desktop E-Mode',
  args: { eModeCategoryName: 'Stablecoins' },
}

export const MobileEMode: Story = {
  name: 'Mobile E-Mode',
  ...getMobileStory(DesktopEMode),
}
export const TabletEMode: Story = {
  name: 'Tablet E-Mode',
  ...getTabletStory(DesktopEMode),
}
