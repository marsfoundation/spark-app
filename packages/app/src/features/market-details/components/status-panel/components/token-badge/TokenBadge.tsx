import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { cn } from '@/ui/utils/style'

export interface TokenBadgeProps {
  symbol: TokenSymbol
}

export function TokenBadge({ symbol }: TokenBadgeProps) {
  const tokenImage = getTokenImage(symbol)

  return (
    <div
      className={cn(
        'text-prompt-foreground flex w-fit flex-row',
        'items-center gap-2 rounded-xl p-1.5 sm:p-2.5',
        getTokenBgColor(symbol),
      )}
    >
      <img src={tokenImage} alt={symbol} className="h-6 w-6" />
      <span className="hidden sm:block">{symbol}</span>
    </div>
  )
}

function getTokenBgColor(symbol: TokenSymbol) {
  switch (symbol) {
    case 'DAI':
      return 'bg-product-dai/10'
    case 'sDAI':
      return 'bg-product-sdai/10'
    default:
      return 'bg-light-blue/10'
  }
}
