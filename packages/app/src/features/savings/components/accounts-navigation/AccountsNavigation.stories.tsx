import { TokenSymbol } from '@/domain/types/TokenSymbol'
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

function InteractiveNavigation({ variant }: { variant: 'vertical' | 'horizontal' }) {
  const [activeToken, setActiveToken] = useState(TokenSymbol('sUSDS'))

  const accounts = [
    {
      underlyingToken: tokens.USDS,
      savingsToken: tokens.sUSDS,
      underlyingTokenDeposit: NormalizedUnitNumber(1_000_000_000),
    },
    {
      underlyingToken: tokens.USDC,
      savingsToken: tokens.sUSDC,
      underlyingTokenDeposit: NormalizedUnitNumber(0),
    },
    {
      underlyingToken: tokens.DAI,
      savingsToken: tokens.sDAI,
      underlyingTokenDeposit: NormalizedUnitNumber(200_000),
    },
  ]

  return (
    <AccountsNavigation
      accounts={accounts}
      selectedAccount={activeToken}
      setSelectedAccount={setActiveToken}
      variant={variant}
    />
  )
}

export const Vertical: Story = {
  render: () => (
    <div className="max-w-48">
      <InteractiveNavigation variant="vertical" />
    </div>
  ),
}

export const Horizontal: Story = getMobileStory({
  render: () => (
    <div className="w-full overflow-x-auto p-4">
      <InteractiveNavigation variant="horizontal" />
    </div>
  ),
})
