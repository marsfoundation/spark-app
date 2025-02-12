import { getOriginChainId } from '@/domain/hooks/useOriginChainId'
import { useStore } from '@/domain/state'
import { assets } from '@/ui/assets'
import { arbitrum, base, gnosis, mainnet } from 'viem/chains'
import { AppConfig } from '../feature-flags'
import { arbitrumConfig } from './configs/arbitrum'
import { baseConfig } from './configs/base'
import { gnosisConfig } from './configs/gnosis'
import { mainnetConfig } from './configs/mainnet'
import { ChainConfigEntry, ChainMeta, SupportedChainId } from './types'

const chainConfig: Record<SupportedChainId, ChainConfigEntry> = {
  [mainnet.id]: mainnetConfig,
  [gnosis.id]: gnosisConfig,
  [base.id]: baseConfig,
  [arbitrum.id]: arbitrumConfig,
}

export function getChainConfigEntry(chainId: number): ChainConfigEntry {
  const sandboxConfig = useStore.getState().appConfig.sandbox
  const sandbox = useStore.getState().sandbox.network

  const originChainId = getOriginChainId(chainId, sandbox)
  if (originChainId !== chainId) {
    return {
      ...chainConfig[originChainId],
      meta: getSandboxChainMeta(chainConfig[originChainId].meta, sandboxConfig),
    }
  }

  return chainConfig[chainId]
}

function getSandboxChainMeta(originChainMeta: ChainMeta, sandboxConfig: AppConfig['sandbox']): ChainMeta {
  return {
    ...originChainMeta,
    name: sandboxConfig?.chainName || originChainMeta.name,
    logo: assets.magicWandCircle,
  }
}
