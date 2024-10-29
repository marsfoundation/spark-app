import { paths } from '@/config/paths'
import { Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'
import { TopbarNavigation } from './TopbarNavigation'

const meta: Meta<typeof TopbarNavigation> = {
  title: 'Components/Molecules/New/TopbarNavigation',
  decorators: [withRouter, WithClassname('min-w-[400px] min-h-[400px] p-4')],
  component: TopbarNavigation,
  args: {
    topbarNavigationInfo: {
      daiSymbol: 'DAI',
    },
    blockedPages: [],
    savingsInfo: {
      data: {
        apy: Percentage(0.05),
      } as any,
      isLoading: false,
    },
  },
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
