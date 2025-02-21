import { Percentage, raise } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent } from '@storybook/test'
import { within } from '@storybook/test'
import { arbitrum, base, mainnet } from 'viem/chains'
import { OngoingCampaign } from '../../types'
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
    platform: 'x',
    link: 'https://x.com/marsfoundation',
    shortDescription: 'Follow us on X/Twitter and get SPK tokens',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardToken: tokens.SPK,
    involvedTokens: [],
    engage: () => {},
  },
  {
    id: '2',
    type: 'sparklend',
    chainId: arbitrum.id,
    apy: Percentage(0.2),
    shortDescription: 'Deposit wstETH, Borrow USDS or USDC on Arbitrum. Get SKY tokens. Limited time offer.',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    rewardToken: tokens.SKY,
    involvedTokens: [tokens.wstETH, tokens.USDS],
    engage: () => {},
  },
  {
    id: '3',
    type: 'sparklend',
    chainId: mainnet.id,
    apy: Percentage(0.1),
    shortDescription: 'Borrow USDS and get REDSTONE airdrop',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardToken: tokens.REDSTONE,
    involvedTokens: [tokens.USDS],
    engage: () => {},
  },
  {
    id: '4',
    type: 'savings',
    chainId: base.id,
    apy: Percentage(0.1),
    shortDescription: 'Deposit USDS and get SPK tokens',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardToken: tokens.SPK,
    involvedTokens: [tokens.sUSDS],
    engage: () => {},
  },
  {
    id: '5',
    type: 'external',
    link: 'https://www.google.com',
    shortDescription: 'Search the web and get SPK tokens',
    longDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rewardToken: tokens.SPK,
    involvedTokens: [],
    engage: () => {},
  },
]

const args: Story['args'] = {
  ongoingCampaignsQueryResult: {
    data,
    isPending: false,
    isError: false,
    error: null,
  },
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
    ongoingCampaignsQueryResult: { data: undefined, isPending: true, isError: false, error: null },
  },
}
export const PendingMobile = getMobileStory(Pending)
export const PendingTablet = getTabletStory(Pending)

export const ErrorState: Story = {
  args: {
    ...args,
    ongoingCampaignsQueryResult: {
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('Could not fetch rewards'),
    },
  },
}
export const ErrorStateMobile = getMobileStory(ErrorState)
export const ErrorStateTablet = getTabletStory(ErrorState)
