import { Meta, StoryObj } from '@storybook/react'

import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { Address } from './Address'

const meta: Meta<typeof Address> = {
  title: 'Components/Atoms/Address',
  component: Address,
  args: {
    address: tokens.DAI.address,
    compact: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Ellipsis: Story = {
  decorators: [WithClassname('w-40')],
}

export const Compact: Story = {
  args: {
    compact: true,
  },
}

export const WithPostfix: Story = {
  args: {
    compact: true,
    postfix: <BoxArrowTopRight className="h-3.5 w-3.5" />,
  },
}
export const EllipsisWithPostfix: Story = {
  args: {
    compact: false,
    postfix: <BoxArrowTopRight className="h-3.5 w-3.5" />,
  },
  decorators: [WithClassname('w-64')],
}
