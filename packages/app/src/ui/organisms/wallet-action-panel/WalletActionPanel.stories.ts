import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { assets } from '@/ui/assets'

import { WalletActionPanel } from './WalletActionPanel'

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]

const meta: Meta<typeof WalletActionPanel> = {
  title: 'Components/Organisms/ConnectWalletPanel',
  component: WalletActionPanel,
  args: {
    callToAction: 'Connect your wallet to use Spark',
    actionButtonTitle: 'Connect wallet',
    iconPaths: WALLET_ICONS_PATHS,
    walletAction: () => {},
  },
}

export default meta
type Story = StoryObj<typeof WalletActionPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
