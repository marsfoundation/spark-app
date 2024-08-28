import { withSuspense } from '@/ui/utils/withSuspense'

import { FarmDetailsSkeleton } from './components/skeleton/FarmDetailsSkeleton'
import { useFarmDetails } from './logic/useFarmDetails'
import { FarmDetailsView } from './views/FarmDetailsView'

function FarmDetailsContainer() {
  useFarmDetails()

  return <FarmDetailsView />
}

const FarmDetailsContainerWithSuspense = withSuspense(FarmDetailsContainer, FarmDetailsSkeleton)
export { FarmDetailsContainerWithSuspense as FarmDetailsContainer }
