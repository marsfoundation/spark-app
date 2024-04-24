import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'

import { MarketOverview, WalletOverview } from '../types'

export interface MarketDetailsViewProps {
  token: Token
  chainName: string
  chainId: number
  marketOverview: MarketOverview
  walletOverview: WalletOverview
  openConnectModal: () => void
  openDialog: OpenDialogFunction
}
