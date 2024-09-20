import { Meta, StoryObj } from '@storybook/react'

import { WithClassname } from '@storybook/decorators'
import { tokens } from '@storybook/tokens'
import { Address, AddressProps } from './Address'

const meta: Meta<typeof Address> = {
  title: 'Components/Atoms/Address',
  component: Address,
  args: {
    address: tokens.DAI.address,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const WithNoMaxWidth: Story = {
  args: {},
}

export const Short: Story = {
  decorators: [WithClassname('w-40 outline outline-basics-dark-grey/40')],
}
export const WithLast6Characters: Story = {
  args: {
    endVisibleCharacters: 6,
  },
  decorators: [WithClassname('w-64 outline outline-basics-dark-grey/40')],
}

export const AddressWithControls = {
  args: {
    width: 50,
  },
  render: ({ width, ...props }: AddressProps & { width: number }) => (
    <div
      className="border border-basics-dark-grey/40"
      style={{
        width: `${width}%`,
      }}
    >
      <Address {...props} />
    </div>
  ),
  argTypes: {
    width: { control: { type: 'range', min: 10, max: 100, step: 5 } },
  },
}
