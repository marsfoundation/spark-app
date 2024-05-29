import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface BorrowRateBannerProps {
  symbol: TokenSymbol
  borrowRate: Percentage
}

export function BorrowRateBanner({ symbol, borrowRate }: BorrowRateBannerProps) {
  return (
    <div className="flex flex-col items-center md:mt-12">
      <Typography variant="h1" className="text-4xl md:text-5xl">
        Spark your DeFi
      </Typography>
      <Typography variant="h3" className="mt-6 text-center text-lg text-prompt-foreground md:text-2xl">
        Borrow {symbol} at{' '}
        <span className="rounded bg-primary p-1 text-background">{formatPercentage(borrowRate)}</span> directly from
        Maker
      </Typography>
    </div>
  )
}
