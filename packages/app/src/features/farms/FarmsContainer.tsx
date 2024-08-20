import { withSuspense } from '@/ui/utils/withSuspense'
import { FarmsSkeleton } from './components/skeleton/FarmsSkeleton'
import { FarmsView } from './views/FarmsView'

function FarmsContainer() {
  return <FarmsView />
}

const FarmsContainerWithSuspense = withSuspense(FarmsContainer, FarmsSkeleton)
export { FarmsContainerWithSuspense as FarmsContainer }
