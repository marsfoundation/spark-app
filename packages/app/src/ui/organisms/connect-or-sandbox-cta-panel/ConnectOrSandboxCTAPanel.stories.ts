import { assets } from '@/ui/assets'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { ConnectOrSandboxCTAPanel } from './ConnectOrSandboxCTAPanel'

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]

const meta: Meta<typeof ConnectOrSandboxCTAPanel> = {
  title: 'Components/Organisms/ConnectOrSandboxCTAPanel',
  component: ConnectOrSandboxCTAPanel,
  args: {
    header: 'Connect your wallet and start saving!',
    buttonText: 'Connect wallet',
    iconPaths: WALLET_ICONS_PATHS,
    action: () => {},
    openSandboxModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ConnectOrSandboxCTAPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
