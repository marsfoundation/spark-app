import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { IconPill } from '@/ui/atoms/icon-pill/IconPill'

interface TokenPillProps {
  tokenSymbol: TokenSymbol
}

export function TokenPill({ tokenSymbol }: TokenPillProps) {
  const tokenImage = getTokenImage(tokenSymbol)

  return <IconPill icon={tokenImage} />
}
