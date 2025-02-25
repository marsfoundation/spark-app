/**
 * Generate a semi-random chainId with a prefix of 7357 (test) so it shouldn't collide with any real network.
 * Having unique chainIds makes DX better when adding custom chains to wallets.
 */
export function getRandomChainId(): number {
  const uniquePostfix = Math.floor(Math.random() * longestSafePostfix)
  const paddedPostfix = uniquePostfix.toString().padStart(longestSafePostfix.toString().length, '0')

  return Number.parseInt(`7357${paddedPostfix}`)
}

const longestSafePostfix = 99_999 // final chainId should be less than 2^32-1, so 7357 prefix leaves us with 5 digits for the rest
