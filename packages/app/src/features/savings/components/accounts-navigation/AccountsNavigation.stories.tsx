import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AccountsNavigation } from './AccountsNavigation'

const meta: Meta<typeof AccountsNavigation> = {
  title: 'Features/Savings/Components/AccountsNavigation',
  component: AccountsNavigation,
  decorators: [WithTooltipProvider(), WithClassname('max-w-48')],
}

export default meta
type Story = StoryObj<typeof AccountsNavigation>

const InteractiveNavigation = () => {
  const [activeToken, setActiveToken] = useState('USDS')

  const accounts = [
    {
      token: tokens.USDS,
      deposit: NormalizedUnitNumber(1_000_000_000),
      active: activeToken === 'USDS',
      onClick: () => setActiveToken('USDS'),
    },
    {
      token: tokens.USDC,
      deposit: NormalizedUnitNumber(0),
      active: activeToken === 'USDC',
      onClick: () => setActiveToken('USDC'),
    },
    {
      token: tokens.DAI,
      deposit: NormalizedUnitNumber(200_000),
      active: activeToken === 'DAI',
      onClick: () => setActiveToken('DAI'),
    },
  ]

  return <AccountsNavigation accounts={accounts} />
}

export const Navigation: Story = {
  render: () => <InteractiveNavigation />,
}
export const Mobile = getMobileStory(Navigation)
