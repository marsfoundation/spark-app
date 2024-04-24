import { WithClassname } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'

import { Percentage } from '@/domain/types/NumericValues'
import { DSRBadge } from '@/features/savings/components/navbar-item/DSRBadge'

import { NavLinkComponent } from './NavLink'

const meta: Meta<typeof NavLinkComponent> = {
  title: 'Features/Navbar/Components/NavLink',
  component: NavLinkComponent,
  decorators: [withRouter, WithClassname('w-fit')],
}

export default meta
type Story = StoryObj<typeof NavLinkComponent>

export const NavLinkComponentDefault: Story = {
  name: 'NavLinkComponent',
  args: {
    selected: false,
    to: '/',
    children: 'Borrow',
  },
}

export const NavItemComponentSelected: Story = {
  name: 'NavLinkComponent (Selected)',
  args: {
    selected: true,
    to: '/',
    children: 'Borrow',
  },
}

export const NavItemComponentSavings: Story = {
  name: 'NavLinkComponent (Savings)',
  args: {
    selected: false,
    to: '/',
    children: 'Cash & Savings',
    postfix: <DSRBadge dsr={Percentage(0.05)} isLoading={false} />,
  },
}

export const NavItemComponentSavingsLoading: Story = {
  name: 'NavLinkComponent (Savings loading)',
  args: {
    selected: false,
    to: '/',
    children: 'Cash & Savings',
    postfix: <DSRBadge dsr={Percentage(0.05)} isLoading={true} />,
  },
}
