import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AccountsNavigation } from './AccountsNavigation'

const meta: Meta<typeof AccountsNavigation> = {
  title: 'Features/Savings/Components/AccountsNavigation',
  component: AccountsNavigation,
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof AccountsNavigation>

function InteractiveNavigation() {
  const [activeToken, setActiveToken] = useState('USDS')

  const accounts = [
    {
      token: tokens.USDS,
      deposited: NormalizedUnitNumber(1_000_000_000),
      active: activeToken === 'USDS',
      onClick: () => setActiveToken('USDS'),
    },
    {
      token: tokens.USDC,
      deposited: NormalizedUnitNumber(0),
      active: activeToken === 'USDC',
      onClick: () => setActiveToken('USDC'),
    },
    {
      token: tokens.DAI,
      deposited: NormalizedUnitNumber(200_000),
      active: activeToken === 'DAI',
      onClick: () => setActiveToken('DAI'),
    },
  ]

  return <AccountsNavigation accounts={accounts} />
}

export const Navigation: Story = {
  render: () => (
    <div className="max-w-48">
      <InteractiveNavigation />
    </div>
  ),
}

export const Mobile: Story = {
  ...getMobileStory(Navigation),
  render: () => (
    <div className="w-full overflow-x-auto p-4">
      <InteractiveNavigation />
    </div>
  ),
}
