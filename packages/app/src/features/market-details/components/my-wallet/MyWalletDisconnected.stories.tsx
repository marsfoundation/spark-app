import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { MyWalletDisconnected } from './MyWalletDisconnected'

const meta: Meta<typeof MyWalletDisconnected> = {
  title: 'Features/MarketDetails/Components/MyWallet/MyWalletDisconnected',
  component: MyWalletDisconnected,
  args: {
    openConnectModal: () => {},
  },
  decorators: [WithClassname('max-w-xs')],
}

export default meta
type Story = StoryObj<typeof MyWalletDisconnected>

export const Default: Story = {
  name: 'Default',
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
