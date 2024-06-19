import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { Banana } from 'lucide-react'
import { ButtonStack } from './ButtonStack'

const meta: Meta<typeof ButtonStack> = {
  title: 'Components/Molecules/ButtonStack',
  component: ButtonStack,
  args: {
    primaryButton: {
      text: 'Primary Button Text',
      onClickAction: () => {},
      header: 'Primary button header',
    },
    secondaryButton: {
      text: 'Secondary Button Text',
      onClickAction: () => {},
      header: 'Secondary button header',
      prefixIcon: <Banana className="h-5 w-5 text-basics-dark-grey" />,
    },
  },
}

export default meta
type Story = StoryObj<typeof ButtonStack>

export const Default: Story = {
  name: 'Default',
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
