import { Meta, StoryObj } from '@storybook/react'
import { getHoveredStory } from '@storybook/utils'

import { SparkInfoPanel } from './SparkInfoPanel'

const meta: Meta<typeof SparkInfoPanel> = {
  title: 'Components/Molecules/SparkInfoPanel',
  component: SparkInfoPanel,
  args: {
    title: <>Title</>,
    content: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non ex in nibh ullamcorper eleifend quis
        tincidunt velit. Cras mollis tincidunt porta. Donec justo augue.{' '}
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof SparkInfoPanel>

export const Default: Story = {
  name: 'Default',
}

export const Hovered = getHoveredStory(Default, 'button')
