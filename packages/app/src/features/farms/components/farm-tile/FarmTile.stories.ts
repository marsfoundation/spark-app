import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmTile } from './FarmTile'

const meta: Meta<typeof FarmTile> = {
  title: 'Features/Farms/Components/FarmTile',
  component: FarmTile,
  decorators: [WithClassname('flex w-80')],
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
