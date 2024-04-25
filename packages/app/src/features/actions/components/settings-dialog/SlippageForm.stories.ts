import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { SlippageForm } from './SlippageForm'

const meta: Meta<typeof SlippageForm> = {
  title: 'Features/Actions/SlippageForm',
  component: SlippageForm,
  decorators: [WithClassname('max-w-xl')],
}

export default meta
type Story = StoryObj<typeof SlippageForm>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
