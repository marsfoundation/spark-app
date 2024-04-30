import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { SettingsDialogContent } from './SettingsDialogContent'

const meta: Meta<typeof SettingsDialogContent> = {
  title: 'Features/Actions/SettingsDialogContent',
  component: SettingsDialogContent,
  decorators: [WithClassname('max-w-xl')],
}

export default meta
type Story = StoryObj<typeof SettingsDialogContent>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
