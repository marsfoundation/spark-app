import { WalletList, getDefaultWallets } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  metaMaskWallet,
  okxWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

const { wallets } = getDefaultWallets()
const popularWallets = wallets[0]

export function getWallets(): WalletList {
  return [
    {
      groupName: popularWallets?.groupName ?? 'Popular',
      wallets: [
        // Always shown
        ...(popularWallets?.wallets ?? [rainbowWallet, coinbaseWallet, metaMaskWallet, walletConnectWallet]),
        // Safe wallet (shown when available)
        safeWallet,
        okxWallet,
      ],
    },
  ]
}
