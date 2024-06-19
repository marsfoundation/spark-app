import { assets } from '@/ui/assets'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { CallToActionPanel } from './CallToActionPanel'

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]

const meta: Meta<typeof CallToActionPanel> = {
  title: 'Components/Organisms/CallToActionPanel',
  component: CallToActionPanel,
  args: {
    header: 'Connect your wallet and start saving!',
    buttonText: 'Connect wallet',
    iconPaths: WALLET_ICONS_PATHS,
    action: () => {},
    openSandboxModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CallToActionPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
