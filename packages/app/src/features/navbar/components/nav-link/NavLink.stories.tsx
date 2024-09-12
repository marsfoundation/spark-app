import { WithClassname } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { Percentage } from '@/domain/types/NumericValues'

import { SavingsAPYBadge } from '@/features/savings/components/navbar-item/SavingsAPYBadge'
import { NavLink } from './NavLink'

const meta: Meta<typeof NavLink> = {
  title: 'Features/Navbar/Components/NavLink',
  component: NavLink,
  decorators: [withRouter, WithClassname('w-fit')],
}

export default meta
type Story = StoryObj<typeof NavLink>

export const NavLinkDefault: Story = {
  name: 'NavLink',
  args: {
    selected: false,
    to: '/',
    children: 'Borrow',
  },
}

export const NavLinkSm: Story = {
  name: 'NavLinkSmall',
  args: {
    selected: false,
    to: '/',
    children: 'Borrow',
    size: 'sm',
  },
}

export const NavItemComponentSelected: Story = {
  name: 'NavLink (Selected)',
  args: {
    selected: true,
    to: '/',
    children: 'Borrow',
  },
}

export const NavItemComponentHorizontalSelected: Story = {
  name: 'NavLink (Vertical Selected)',
  args: {
    selected: true,
    to: '/',
    children: 'Borrow',
    variant: 'vertical',
  },
}

export const NavItemComponentSavings: Story = {
  name: 'NavLink (Savings)',
  args: {
    selected: false,
    to: '/',
    children: 'Cash & Savings',
    postfix: <SavingsAPYBadge APY={Percentage(0.05)} isLoading={false} />,
  },
}

export const NavItemComponentSavingsLoading: Story = {
  name: 'NavLink (Savings loading)',
  args: {
    selected: false,
    to: '/',
    children: 'Cash & Savings',
    postfix: <SavingsAPYBadge APY={Percentage(0.05)} isLoading={true} />,
  },
}
