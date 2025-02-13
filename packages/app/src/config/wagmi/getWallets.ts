import { assert } from '@marsfoundation/common-universal'
import { WalletList, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { okxWallet, safeWallet } from '@rainbow-me/rainbowkit/wallets'
import { Buffer } from 'buffer'

export function getWallets(): WalletList {
  // @note: polyfill Buffer for browser to support coinbase wallet mobile connection
  if (!window.Buffer) {
    window.Buffer = Buffer
  }

  const popularWalletsGroup = getDefaultWallets().wallets[0]
  assert(popularWalletsGroup, 'Popular wallets group should be defined')
  const { groupName, wallets: popularWallets } = popularWalletsGroup

  const isSafeContext = typeof window !== 'undefined' && window.parent !== window

  const wallets = [
    ...popularWallets.filter((wallet) => wallet.name !== 'safeWallet'),
    ...(isSafeContext ? [safeWallet] : []),
    okxWallet,
  ]

  return [
    {
      groupName,
      wallets,
    },
  ]
}
