import { getChainConfigEntry } from "@/config/chain"
import { paths } from "@/config/paths"
import { useChainId } from "wagmi"
import { matchPath, useLocation } from "react-router-dom"
import { mainnet } from "viem/chains"

export function usePageChainId(): number {
  const chainId = useChainId()
  const location = useLocation()
  const supportedPages = getChainConfigEntry(chainId).supportedPages

  const currentPage = Object.entries(paths).find(([_, path]) => 
    matchPath(path, location.pathname)
  )?.[0]

  if (currentPage && supportedPages.includes(currentPage as keyof typeof paths)) {
    return chainId
  }

  return mainnet.id
}
