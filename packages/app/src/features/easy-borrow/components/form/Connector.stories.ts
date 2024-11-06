import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { Connector } from './Connector'

const meta: Meta<typeof Connector> = {
  title: 'Features/EasyBorrow/Components/Form/Connector',
  component: Connector,
  decorators: [WithClassname('w-24')],
}

export default meta

type Story = StoryObj<typeof Connector>

export const Default: Story = {}
