import { OpenDialogFunction } from '@/domain/state/dialogs'

import { UseMarketDetailsResult } from '../logic/useMarketDetails'

export interface MarketDetailsViewProps extends UseMarketDetailsResult {
  openConnectModal: () => void
  openDialog: OpenDialogFunction
}
