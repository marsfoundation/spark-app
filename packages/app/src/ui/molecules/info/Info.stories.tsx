import { WithTooltipProvider } from '@storybook-config/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { Info } from './Info'

const meta: Meta<typeof Info> = {
  title: 'Components/Molecules/Info',
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof Info>

export const Default: Story = {
  name: 'Default',
  render: () => <Info>Info about the thing</Info>,
}
