import { useBreakpoint } from '@/ui/utils/useBreakpoint'
import { Topbar } from './components/topbar/Topbar'
import { useTopbar } from './logic/useTopbar'

export function TopbarContainer() {
  const fromTabletDisplay = useBreakpoint('sm')
  const topbarInfo = useTopbar({
    isMobileDisplay: !fromTabletDisplay,
  })

  return <Topbar {...topbarInfo} />
}
