import { Meta, StoryObj } from '@storybook/react'

import { tokens } from '@storybook/tokens'
import { Address } from './Address'

const meta: Meta<typeof Address> = {
  title: 'Components/Atoms/Address',
  component: Address,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithNoMaxWidth: Story = {
  args: {},
  render: () => <Address address={tokens.DAI.address} />,
}
export const Short: Story = {
  args: {},
  render: () => (
    <div className="max-w-40  border-spacing-2 border border-basics-dark-grey">
      <Address address={tokens.DAI.address} />
    </div>
  ),
}
export const WithLast6Characters: Story = {
  args: {},
  render: () => (
    <div className="max-w-40 bg-red-300">
      <Address address={tokens.DAI.address} endVisibleCharacters={7} />
    </div>
  ),
}
