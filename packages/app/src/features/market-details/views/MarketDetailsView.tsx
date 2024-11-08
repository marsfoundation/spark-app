import { useBreakpoint } from '@/ui/utils/useBreakpoint'

import { CompactView } from './components/CompactView'
import { FullView } from './components/FullView'
import { MarketDetailsViewProps } from './types'

export function MarketDetailsView(props: MarketDetailsViewProps) {
  const lg = useBreakpoint('lg')

  if (lg) {
    return <FullView {...props} />
  }

  return <CompactView {...props} />
}
