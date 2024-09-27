import { paths } from '@/config/paths'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { useEffect } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useConfig } from 'wagmi'
import { watchChainId } from 'wagmi/actions'
import { useMarketDetailsParams } from './useMarketDetailsParams'

export function useSandboxMarketRedirect(): void {
  const config = useConfig()
  const { asset, chainId: marketChainId } = useMarketDetailsParams()
  const { sandboxChainId, originChainId } = useSandboxState()
  const navigate = useNavigate()

  useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(chainId, prevChainId) {
        if (chainId === sandboxChainId && prevChainId === originChainId && prevChainId === marketChainId) {
          navigate(generatePath(paths.marketDetails, { chainId: sandboxChainId.toString(), asset }))
          return
        }

        navigate(generatePath(paths.markets))
      },
    })

    return unwatch
  }, [config, sandboxChainId, originChainId, asset, marketChainId, navigate])
}
