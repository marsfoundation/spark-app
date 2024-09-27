import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { useEffect } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useConfig } from 'wagmi'
import { watchChainId } from 'wagmi/actions'

interface UseSandboxPageRedirectParams {
  basePath: string
  fallbackPath: string
  params?: {
    [key: string]: unknown
    chainId?: number
  }
}

export function useSandboxPageRedirect({ basePath, fallbackPath, params }: UseSandboxPageRedirectParams): void {
  const config = useConfig()
  const { sandboxChainId, originChainId } = useSandboxState()
  const navigate = useNavigate()

  useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(chainId, prevChainId) {
        if (chainId === sandboxChainId && prevChainId === originChainId && prevChainId === params?.chainId) {
          navigate(generatePath(basePath, { ...params, chainId: sandboxChainId.toString() }))
          return
        }

        navigate(generatePath(fallbackPath))
      },
    })

    return unwatch
  }, [config, sandboxChainId, originChainId, basePath, fallbackPath, navigate, params])
}
