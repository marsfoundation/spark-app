import { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Atoms/Checkbox',
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  name: 'Unchecked',
  render: () => <Checkbox />,
}

export const Checked: Story = {
  name: 'Checked',
  render: () => <Checkbox checked />,
}
