import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Percentage } from '@/domain/types/NumericValues'

import { LoanToValueSlider } from './LoanToValueSlider'

const meta: Meta<typeof LoanToValueSlider> = {
  title: 'Components/Atoms/New/LoanToValueSlider',
  component: LoanToValueSlider,
}

export default meta
type Story = StoryObj<typeof LoanToValueSlider>

export const Default: Story = {
  name: 'Default',
  render: () => <Component />,
}

function Component() {
  const [value, setValue] = useState<Percentage>(Percentage(0.55))

  return (
    <LoanToValueSlider
      ltv={value}
      className="mt-10"
      liquidationLtv={Percentage(0.825)}
      maxAvailableLtv={Percentage(0.8)}
      onLtvChange={(v) => setValue(v)}
    />
  )
}
