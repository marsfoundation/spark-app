import { withSuspense } from '@/ui/utils/withSuspense'
import { FarmsSkeleton } from './components/skeleton/FarmsSkeleton'
import { useFarms } from './logic/useFarms'
import { FarmsView } from './views/FarmsView'

function FarmsContainer() {
  const { farms, activeFarms } = useFarms()

  return <FarmsView farms={farms} activeFarms={activeFarms} />
}

const FarmsContainerWithSuspense = withSuspense(FarmsContainer, FarmsSkeleton)
export { FarmsContainerWithSuspense as FarmsContainer }
