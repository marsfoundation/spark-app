import { withSuspense } from '@/ui/utils/withSuspense'
import { FarmsSkeleton } from './components/skeleton/FarmsSkeleton'
import { useFarms } from './logic/useFarms'
import { FarmsView } from './views/FarmsView'

function FarmsContainer() {
  const { activeFarms, inactiveFarms, chainId } = useFarms()

  return <FarmsView inactiveFarms={inactiveFarms} activeFarms={activeFarms} chainId={chainId} />
}

const FarmsContainerWithSuspense = withSuspense(FarmsContainer, FarmsSkeleton)
export { FarmsContainerWithSuspense as FarmsContainer }
