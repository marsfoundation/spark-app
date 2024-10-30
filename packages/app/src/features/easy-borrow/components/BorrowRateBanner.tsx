import { formatPercentage } from '@/domain/common/format'
import { Typography } from '@/ui/atoms/typography/Typography'
import { BorrowDetails } from '../logic/useEasyBorrow'

export interface BorrowRateBannerProps {
  assetsToBorrowMeta: BorrowDetails
}

export function BorrowRateBanner({ assetsToBorrowMeta }: BorrowRateBannerProps) {
  const { dai, usds, borrowRate } = assetsToBorrowMeta
  return (
    <div className="flex flex-col items-center md:mt-12">
      <Typography variant="h1" className="text-4xl md:text-5xl">
        Spark your DeFi
      </Typography>
      <Typography variant="h3" className="mt-6 text-center text-lg text-prompt-foreground md:text-2xl">
        Borrow {dai}
        {usds ? ` or ${usds}` : ''} at{' '}
        <span className="rounded bg-primary p-1 text-white">{formatPercentage(borrowRate)}</span> directly from Sky
      </Typography>
    </div>
  )
}
