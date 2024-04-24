import { useBreakpoint } from '@/ui/utils/useBreakpoint'

import { CompactView } from './components/CompactView'
import { FullView } from './components/FullView'
import { MarketDetailsViewProps } from './types'

export function MarketDetailsView(props: MarketDetailsViewProps) {
  const tablet = useBreakpoint('sm')

  if (tablet) {
    return <FullView {...props} />
  }

  return <CompactView {...props} />
}
