import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { Typography } from '@/ui/atoms/typography/Typography'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

import { ExistingPosition } from '../../logic/types'

export interface TokenSummaryProps {
  position: ExistingPosition
  type: 'borrow' | 'deposit'
  maxSymbols?: number
}

export function TokenSummary({ position, type, maxSymbols = 3 }: TokenSummaryProps) {
  const summary = `Already ${type === 'borrow' ? 'borrowed' : 'deposited'} ~${USD_MOCK_TOKEN.formatUSD(
    position.totalValueUSD,
  )}`

  const tokenIconPaths = position.tokens.map((token) => getTokenImage(token.symbol))

  return (
    <div className="flex items-center rounded-xl bg-light-blue/10 p-4">
      <IconStack paths={tokenIconPaths} maxIcons={maxSymbols} />
      <Typography className="ml-3 font-semibold text-secondary tracking-wide" variant="prompt">
        {summary}
      </Typography>
    </div>
  )
}
