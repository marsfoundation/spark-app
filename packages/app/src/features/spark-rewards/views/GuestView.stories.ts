import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { mainnet } from 'viem/chains'
import { GuestView, GuestViewProps } from './GuestView'

const meta: Meta<typeof GuestView> = {
  title: 'Features/SparkRewards/Views/GuestView',
  component: GuestView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [WithTooltipProvider(), withRouter()],
  args: {
    ongoingCampaignsResult: {
      data: [
        {
          id: 'campaign-1',
          type: 'sparklend',
          rewardChainId: mainnet.id,
          chainId: mainnet.id,
          shortDescription: 'Early Bird Rewards',
          longDescription: 'Earn rewards for being an early adopter',
          rewardTokenSymbol: tokens.SPK.symbol,
          involvedTokensSymbols: [tokens.sUSDS.symbol],
          restrictedCountryCodes: [],
          onEngageButtonClick: () => Promise.resolve(),
        },
        {
          id: 'campaign-2',
          type: 'social',
          rewardChainId: mainnet.id,
          platform: 'x',
          link: 'https://x.com/marsfoundation',
          shortDescription: 'Social Media Rewards',
          longDescription: 'Earn rewards for social media engagement',
          rewardTokenSymbol: tokens.SPK.symbol,
          involvedTokensSymbols: [],
          restrictedCountryCodes: [],
          onEngageButtonClick: () => Promise.resolve(),
        },
      ],
      isPending: false,
      isError: false,
      error: null,
    },
  } satisfies GuestViewProps,
}

export default meta
type Story = StoryObj<typeof GuestView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Loading: Story = {
  args: {
    ongoingCampaignsResult: {
      data: undefined,
      isPending: true,
      isError: false,
      error: null,
    },
  },
}
export const LoadingMobile = getMobileStory(Loading)
export const LoadingTablet = getTabletStory(Loading)

export const ErrorState: Story = {
  args: {
    ongoingCampaignsResult: {
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('Failed to load campaigns'),
    },
  },
}
export const ErrorStateMobile = getMobileStory(ErrorState)
export const ErrorStateTablet = getTabletStory(ErrorState)

export const NoCampaigns: Story = {
  args: {
    ongoingCampaignsResult: {
      data: [],
      isPending: false,
      isError: false,
      error: null,
    },
  },
}
export const NoCampaignsMobile = getMobileStory(NoCampaigns)
export const NoCampaignsTablet = getTabletStory(NoCampaigns)
