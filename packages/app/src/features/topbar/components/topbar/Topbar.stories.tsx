import { paths } from '@/config/paths'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { Meta, StoryObj } from '@storybook/react'
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'
import { mainnet } from 'viem/chains'
import { Topbar } from './Topbar'

const meta: Meta<typeof Topbar> = {
  title: 'Features/Topbar/Components/Topbar',
  decorators: [WithTooltipProvider(), withRouter],
  component: Topbar,
  args: {
    menuInfo: {
      isSandboxEnabled: false,
      onSandboxModeClick: () => {},
      buildInfo: {
        sha: 'bdebc69',
        buildTime: '25/10/2024, 10:01:51',
      },
    },
    walletInfo: {
      connectedWalletInfo: {
        dropdownTriggerInfo: {
          mode: 'connected',
          avatar: assets.walletIcons.default,
          address: CheckedAddress('0x1234567890123456789012345678901234567890'),
        },
        dropdownContentInfo: {
          walletIcon: assets.walletIcons.metamask,
          address: CheckedAddress('0x1234567890123456789012345678901234567890'),
          onDisconnect: () => {},
          blockExplorerAddressLink: '/',
        },
      },
      onConnect: () => {},
    },
    navigationInfo: {
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
    networkInfo: {
      currentChain: {
        id: mainnet.id,
        name: 'Ethereum Mainnet',
      },
      onSelectNetwork: () => {},
    },
    rewardsInfo: {
      rewards: [
        {
          token: tokens.wstETH,
          amount: NormalizedUnitNumber(0.00157),
        },
        {
          token: tokens.WBTC,
          amount: NormalizedUnitNumber(0.0003498),
        },
      ],
      onClaim: () => {},
    },
    airdropInfo: {
      airdrop: {
        tokenReward: NormalizedUnitNumber(1_200_345.568),
        tokenRatePerSecond: NormalizedUnitNumber(1),
        tokenRatePrecision: 1,
        refreshIntervalInMs: 100,
        timestampInMs: Date.now() - 30 * 1000,
      },
      isLoading: false,
      isError: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof Topbar>

export const Default: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.savings,
      },
    }),
  },
}
