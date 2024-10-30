import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'

interface UpDownMarkerProps {
  token: Token
  value: NormalizedUnitNumber
  direction: 'up' | 'down'
}

export function UpDownMarker({ token, value, direction }: UpDownMarkerProps) {
  const up = direction === 'up'

  return (
    <div className="flex flex-row gap-2">
      <img src={up ? assets.up : assets.down} alt={`${direction}-sign`} />
      <div className="text-white/50">
        <span className="font-mono">{up ? '+' : '-'}</span>
        {`${token.format(value, { style: 'auto' })} ${token.symbol}`}
      </div>
    </div>
  )
}
