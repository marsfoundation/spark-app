import { SavingsContainer as SavingsContainerWithNst } from '@/features/savings-with-nst/SavingsContainer'
import { SavingsContainer } from '@/features/savings/SavingsContainer'

export function Savings() {
  if (
    typeof import.meta.env.VITE_DEV_NST_NETWORK_RPC_URL === 'string' &&
    import.meta.env.VITE_FEATURE_SAVINGS_PAGE_WITH_NST === '1'
  ) {
    return <SavingsContainerWithNst />
  }

  return <SavingsContainer />
}
