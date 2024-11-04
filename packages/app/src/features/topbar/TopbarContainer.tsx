import { Topbar } from './components/topbar/Topbar'
import { useTopbar } from './logic/useTopbar'

export function TopbarContainer() {
  const topbarInfo = useTopbar()

  return <Topbar {...topbarInfo} />
}
