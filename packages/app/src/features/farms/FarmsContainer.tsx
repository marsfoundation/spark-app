import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { withSuspense } from '@/ui/utils/withSuspense'
import { FarmsSkeleton } from './components/skeleton/FarmsSkeleton'
import { useFarms } from './logic/useFarms'
import { FarmsView } from './views/FarmsView'
import { UnsupportedChainView } from './views/UnsupportedChainView'

function FarmsContainer() {
  const { activeFarms, inactiveFarms, hasFarms, chainId } = useFarms()
  const { switchChain, openSandboxModal } = useUnsupportedChain()

  if (!hasFarms) {
    return <UnsupportedChainView chainId={chainId} switchChain={switchChain} openSandboxModal={openSandboxModal} />
  }

  return <FarmsView inactiveFarms={inactiveFarms} activeFarms={activeFarms} chainId={chainId} />
}

const FarmsContainerWithSuspense = withSuspense(FarmsContainer, FarmsSkeleton)
export { FarmsContainerWithSuspense as FarmsContainer }
