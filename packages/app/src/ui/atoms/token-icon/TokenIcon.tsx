import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { SVGProps, forwardRef } from 'react'

export interface TokenIconProps extends SVGProps<SVGSVGElement> {
  token: {
    symbol: TokenSymbol
    isAToken: boolean
  }
}
export const TokenIcon = forwardRef<SVGSVGElement, TokenIconProps>(({ token, ...rest }, ref) => {
  if (token.isAToken) {
    const symbol = TokenSymbol(token.symbol.slice(1))

    return <ATokenIcon symbol={symbol} {...rest} ref={ref} />
  }

  const imageHref = getTokenImage(token.symbol)

  return (
    <svg ref={ref} viewBox="0 0 256 256" {...rest}>
      <defs>
        <clipPath id="circleClip">
          <circle cx="128" cy="128" r="128" />
        </clipPath>
      </defs>
      <image x="0" y="0" href={imageHref} width="256" height="256" clipPath="url(#circleClip)" />
    </svg>
  )
})
TokenIcon.displayName = 'TokenIcon'

interface ATokenIconProps extends SVGProps<SVGSVGElement> {
  symbol: TokenSymbol
}
const ATokenIcon = forwardRef<SVGSVGElement, ATokenIconProps>(({ symbol, ...rest }, ref) => {
  const imageHref = getTokenImage(symbol)

  return (
    <svg ref={ref} viewBox="0 0 256 256" {...rest}>
      <g>
        <circle cx="128" cy="128" r="120" fill="none" stroke="rgb(243, 151, 25)" strokeWidth="15" />
        <image x="25" y="25" href={imageHref} width="206" height="206" />
      </g>
    </svg>
  )
})
ATokenIcon.displayName = 'ATokenIcon'
