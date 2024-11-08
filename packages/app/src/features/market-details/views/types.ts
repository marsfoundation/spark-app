import { UseMarketDetailsResult } from '../logic/useMarketDetails'

export interface MarketDetailsViewProps extends UseMarketDetailsResult {
  openConnectModal: () => void
}
