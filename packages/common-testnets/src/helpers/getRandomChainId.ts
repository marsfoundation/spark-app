/**
 * Use to generate a chainId with low probability of colliding with real network
 */
export function getRandomChainId(originChainId: number): number {
  return Number.parseInt(`${originChainId}3030${Date.now()}`)
}
