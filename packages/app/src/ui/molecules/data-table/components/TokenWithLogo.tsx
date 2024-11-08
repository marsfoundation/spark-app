import { ReserveStatus } from '@/domain/market-info/reserve-status'
import { Token } from '@/domain/types/Token'
import { ColorFilter } from '@/ui/atoms/color-filter/ColorFilter'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'

import { FrozenPill } from '../../frozen-pill/FrozenPill'
import { PausedPill } from '../../paused-pill/PausedPill'

interface TokenWithLogoProps {
  token: Token
  reserveStatus: ReserveStatus
}

export function TokenWithLogo({ token, reserveStatus }: TokenWithLogoProps) {
  const isPaused = reserveStatus === 'paused'
  const isFrozen = reserveStatus === 'frozen'

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex shrink-0">
        <ColorFilter variant={isPaused ? 'red' : 'none'}>
          <TokenIcon token={token} className="h-6 w-6" />
        </ColorFilter>
      </div>
      <div className={cn('typography-label-4 text-primary', isPaused && 'text-system-error-primary')}>
        {token.symbol}
      </div>
      {isFrozen && <FrozenPill />}
      {isPaused && <PausedPill />}
    </div>
  )
}
