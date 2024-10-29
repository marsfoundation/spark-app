import { paths } from '@/config/paths'
import { Percentage } from '@/domain/types/NumericValues'
import { Meta, StoryObj } from '@storybook/react'
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'
import { TopbarNavigation } from './TopbarNavigation'

const meta: Meta<typeof TopbarNavigation> = {
  title: 'Components/Molecules/TopbarNavigation',
  decorators: [withRouter],
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
