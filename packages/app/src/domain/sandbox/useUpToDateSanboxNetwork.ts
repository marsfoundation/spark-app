import { tryOrDefault } from '@/utils/tryOrDefault'
import { useStore } from '../state'
import { SandboxNetwork } from '../state/sandbox'

const SANDBOX_EXPIRY = 6 * 3600 * 1000 // 6 hours

export function useUpToDateSandboxNetwork(): SandboxNetwork | undefined {
  const sandboxNetwork = useStore((state) => state.sandbox.network)
  const { setNetwork } = useStore((state) => state.sandbox)

  if (!sandboxNetwork) {
    return undefined
  }

  if (isSandboxExpired(sandboxNetwork)) {
    setNetwork(undefined)
    return undefined
  }

  return sandboxNetwork
}

function isSandboxExpired(sandboxNetwork: SandboxNetwork): boolean {
  const createdAt = tryOrDefault(() => {
    return new Date(sandboxNetwork.createdAt)
  }, undefined)

  if (createdAt === undefined) {
    return true
  }

  const now = new Date()
  return now.getTime() - createdAt.getTime() > SANDBOX_EXPIRY
}
