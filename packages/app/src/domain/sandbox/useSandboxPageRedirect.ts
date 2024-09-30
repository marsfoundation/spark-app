import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { useEffect } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useConfig } from 'wagmi'
import { watchChainId } from 'wagmi/actions'

interface UseSandboxPageRedirectParams {
  basePath: string
  fallbackPath: string
  basePathParams?: {
    [key: string]: unknown
    chainId?: number
  }
}

export function useSandboxPageRedirect({ basePath, fallbackPath, basePathParams }: UseSandboxPageRedirectParams): void {
  const config = useConfig()
  const { sandboxChainId, originChainId } = useSandboxState()
  const navigate = useNavigate()

  useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(chainId, prevChainId) {
        if (chainId === sandboxChainId && prevChainId === originChainId && prevChainId === basePathParams?.chainId) {
          navigate(generatePath(basePath, { ...basePathParams, chainId: sandboxChainId.toString() }))
          return
        }

        navigate(generatePath(fallbackPath))
      },
    })

    return unwatch
  }, [config, sandboxChainId, originChainId, basePath, fallbackPath, navigate, basePathParams])
}
