import { OngoingCampaign } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { Percentage, raise } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent } from '@storybook/test'
import { within } from '@storybook/test'
import { arbitrum, base, mainnet } from 'viem/chains'
import { OngoingCampaignsPanel } from './OngoingCampaignsPanel'

const meta: Meta<typeof OngoingCampaignsPanel> = {
  title: 'Features/Rewards/Components/OngoingCampaignsPanel',
  decorators: [WithClassname('max-w-4xl'), WithTooltipProvider()],
  component: OngoingCampaignsPanel,
}

export default meta
type Story = StoryObj<typeof OngoingCampaignsPanel>

const data: OngoingCampaign[] = [
  {
    id: '1',
    type: 'social',
    chainId: mainnet.id,
    platform: 'x',
    link: 'https://x.com/marsfoundation',
    shortDescription: 'Follow us on X/Twitter and get SPK tokens',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardTokenSymbol: tokens.SPK.symbol,
    involvedTokensSymbols: [],
    restrictedCountryCodes: ['US'],
  },
  {
    id: '2',
    type: 'sparklend',
    chainId: arbitrum.id,
    apy: Percentage(0.2),
    shortDescription: 'Deposit wstETH, Borrow USDS or USDC on Arbitrum. Get SKY tokens. Limited time offer.',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    rewardTokenSymbol: tokens.SKY.symbol,
    involvedTokensSymbols: [tokens.wstETH.symbol, tokens.USDS.symbol],
    restrictedCountryCodes: ['US'],
  },
  {
    id: '3',
    type: 'sparklend',
    chainId: mainnet.id,
    apy: Percentage(0.1),
    shortDescription: 'Borrow USDS and get REDSTONE airdrop',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardTokenSymbol: tokens.REDSTONE.symbol,
    involvedTokensSymbols: [tokens.USDS.symbol],
    restrictedCountryCodes: ['US'],
  },
  {
    id: '4',
    type: 'savings',
    chainId: base.id,
    apy: Percentage(0.1),
    shortDescription: 'Deposit USDS and get SPK tokens',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardTokenSymbol: tokens.SPK.symbol,
    involvedTokensSymbols: [tokens.sUSDS.symbol],
    restrictedCountryCodes: ['US'],
  },
  {
    id: '5',
    type: 'external',
    chainId: mainnet.id,
    link: 'https://www.google.com',
    shortDescription: 'Search the web and get SPK tokens',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardTokenSymbol: tokens.SPK.symbol,
    involvedTokensSymbols: [],
    restrictedCountryCodes: ['US'],
  },
]

const args: Story['args'] = {
  ongoingCampaignsResult: {
    data: data.map((campaign) => ({
      ...campaign,
      engage: () => Promise.resolve(),
    })),
    isPending: false,
    isError: false,
    error: null,
  },
  isGuestMode: false,
}

export const Desktop: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    const items = await canvas.findAllByRole('button')
    const firstItem = items[0] ?? raise('No accordion item found')
    await userEvent.click(firstItem)
  },
}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Pending: Story = {
  args: {
    ...args,
    ongoingCampaignsResult: { data: undefined, isPending: true, isError: false, error: null },
  },
}
export const PendingMobile = getMobileStory(Pending)
export const PendingTablet = getTabletStory(Pending)

export const ErrorState: Story = {
  args: {
    ...args,
    ongoingCampaignsResult: {
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('Could not fetch rewards'),
    },
  },
}
export const ErrorStateMobile = getMobileStory(ErrorState)
export const ErrorStateTablet = getTabletStory(ErrorState)

export const GuestMode: Story = {
  args: {
    ...args,
    isGuestMode: true,
  },
}
export const GuestModeMobile = getMobileStory(GuestMode)
export const GuestModeTablet = getTabletStory(GuestMode)
