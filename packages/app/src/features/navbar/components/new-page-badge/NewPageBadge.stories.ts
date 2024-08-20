import { Meta, StoryObj } from '@storybook/react'
import { NewPageBadge } from './NewPageBadge'

const meta: Meta<typeof NewPageBadge> = {
  title: 'Features/Navbar/Components/NewPageBadge',
  component: NewPageBadge,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
