import { Meta, StoryObj } from '@storybook/react'
import { Banana } from 'lucide-react'

import { IndicatorIcon } from './IndicatorIcon'

const meta: Meta<typeof IndicatorIcon> = {
  title: 'Components/Atoms/IndicatorIcon',
}

export default meta
type Story = StoryObj<typeof meta>

export const Green: Story = {
  name: 'Green',
  render: () => {
    return <IndicatorIcon icon={<Banana size={20} />} variant="green" />
  },
}

export const Gray: Story = {
  name: 'Gray',
  render: () => {
    return <IndicatorIcon icon={<Banana size={20} />} variant="gray" />
  },
}

export const Orange: Story = {
  name: 'Orange',
  render: () => {
    return <IndicatorIcon icon={<Banana size={20} />} variant="orange" />
  },
}

export const Red: Story = {
  name: 'Red',
  render: () => {
    return <IndicatorIcon icon={<Banana size={20} />} variant="red" />
  },
}
