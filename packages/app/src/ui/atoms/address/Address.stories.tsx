import { Meta, StoryObj } from '@storybook/react'

import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { WithClassname } from '@storybook/decorators'
import { tokens } from '@storybook/tokens'
import { Address, AddressProps, AddressTruncate, AddressTruncateMiddle } from './Address'

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
    startVisibleCharacters: 6,
    endVisibleCharacters: 4,
  },
  render: ({ width, ...props }: AddressProps & { width: number }) => (
    <div>
      <div
        className="mb-4 flex flex-col gap-2 border border-basics-dark-grey/40"
        style={{
          width: `${width}px`,
        }}
      >
        <AddressTruncate {...props} />
        <AddressTruncateMiddle {...props} />
        <Address {...props} />
      </div>

      <div className="relative w-1/2 border border-basics-dark-grey/40">
        <Address {...props} />

        <div className="mt-4 flex items-center justify-between gap-2">
          <Address {...props} inlineIcon={<BoxArrowTopRight className="h-5 w-5 shrink-0 p-1" />} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Address {...props} />
          <BoxArrowTopRight className="h-5 w-5 shrink-0 p-1" />
        </div>
      </div>
    </div>
  ),
  argTypes: {
    width: { control: { type: 'range', min: 50, max: 500, step: 5 } },
    address: { control: { type: 'text' } },
    startVisibleCharacters: { control: { type: 'number', min: 1, max: 10, step: 1 } },
    endVisibleCharacters: { control: { type: 'number', min: 1, max: 10, step: 1 } },
  },
}
