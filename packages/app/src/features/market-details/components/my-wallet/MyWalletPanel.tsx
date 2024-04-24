import { OpenDialogFunction } from '@/domain/state/dialogs'

import { WalletOverview } from '../../types'
import { MyWallet } from './MyWallet'
import { MyWalletChainMismatch } from './MyWalletChainMismatch'
import { MyWalletDisconnected } from './MyWalletDisconnected'

interface MyWalletPanelProps {
  chainMismatch: boolean
  openDialog: OpenDialogFunction
  walletOverview: WalletOverview
  openConnectModal: () => void
}

export function MyWalletPanel({ openDialog, walletOverview, openConnectModal, chainMismatch }: MyWalletPanelProps) {
  if (walletOverview.guestMode) {
    return <MyWalletDisconnected openConnectModal={openConnectModal} />
  }

  if (chainMismatch) {
    return <MyWalletChainMismatch />
  }

  return <MyWallet openDialog={openDialog} {...walletOverview} />
}
