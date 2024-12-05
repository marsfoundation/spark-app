import { paths } from '@/config/paths'
import { Percentage } from '@marsfoundation/common-universal'
import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'
import { TopbarNavigation, TopbarNavigationProps } from './TopbarNavigation'

const args = {
  borrowSubLinks: [
    {
      to: paths.easyBorrow,
      label: 'Borrow DAI',
    },
    {
      to: paths.myPortfolio,
      label: 'My portfolio',
    },
    {
      to: paths.markets,
      label: 'Markets',
    },
  ],
  isBorrowSubLinkActive: false,
  blockedPages: [],
  savingsInfo: {
    data: {
      apy: Percentage(0.05),
    } as any,
    isLoading: false,
  },
} satisfies TopbarNavigationProps

const meta: Meta<typeof TopbarNavigation> = {
  title: 'Features/Topbar/Components/TopbarNavigation',
  decorators: [withRouter, WithClassname('h-[400px]')],
  component: TopbarNavigation,
  args,
}

export default meta
type Story = StoryObj<typeof TopbarNavigation>

export const SavingsPage: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.savings,
      },
    }),
  },
}

export const FarmsPage: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.farms,
      },
    }),
  },
}

export const MarketsPage: Story = {
  args: {
    ...args,
    isBorrowSubLinkActive: true,
  },
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.markets,
      },
    }),
  },
}

export const SavingsDropdownOpenPage: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.savings,
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    const button = await canvas.findByRole('button', { name: /Borrow/i })

    await userEvent.click(button)
  },
}

export const MarketsDropdownOpenPage: Story = {
  args: {
    ...args,
    isBorrowSubLinkActive: true,
  },
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.markets,
      },
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    const button = await canvas.findByRole('button', { name: /Borrow/i })

    await userEvent.click(button)
  },
}
