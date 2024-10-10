import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { FormatOptions, Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'

interface UpDownMarkerProps {
  token: Token
  value: NormalizedUnitNumber
  direction: 'up' | 'down'
  tokenFormatOptions?: FormatOptions
}

export function UpDownMarker({ token, value, direction, tokenFormatOptions }: UpDownMarkerProps) {
  const up = direction === 'up'

  return (
    <div className="flex flex-row gap-2">
      <img src={up ? assets.up : assets.down} alt={`${direction}-sign`} />
      <div className="text-basics-dark-grey">
        <span className="font-mono">{up ? '+' : '-'}</span>
        {`${token.format(value, { style: 'auto', ...tokenFormatOptions })} ${token.symbol}`}
      </div>
    </div>
  )
}
