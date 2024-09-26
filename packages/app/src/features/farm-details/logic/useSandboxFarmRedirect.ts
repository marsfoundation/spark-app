import { paths } from '@/config/paths'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { useEffect } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useConfig } from 'wagmi'
import { watchChainId } from 'wagmi/actions'
import { useFarmDetailsParams } from './useFarmDetailsParams'

export function useSandboxFarmRedirect(): void {
  const config = useConfig()
  const { address: farmAddress, chainId: farmChainId } = useFarmDetailsParams()
  const { sandboxChainId, originChainId } = useSandboxState()
  const navigate = useNavigate()

  useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(chainId, prevChainId) {
        if (chainId === sandboxChainId && prevChainId === originChainId && prevChainId === farmChainId) {
          navigate(generatePath(paths.farmDetails, { chainId: sandboxChainId.toString(), address: farmAddress }))
          return
        }

        navigate(generatePath(paths.farms))
      },
    })

    return unwatch
  }, [config, sandboxChainId, originChainId, farmAddress, farmChainId, navigate])
}
