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
      <Typography variant="h3" className="text-prompt-foreground mt-6 text-center text-lg md:text-2xl">
        Borrow {symbol} at{' '}
        <span className="bg-primary text-background rounded p-1">{formatPercentage(borrowRate)}</span> directly from
        Maker
      </Typography>
    </div>
  )
}
