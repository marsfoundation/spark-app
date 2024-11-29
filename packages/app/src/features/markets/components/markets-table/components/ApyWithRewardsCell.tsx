import { VariantProps, cva } from 'class-variance-authority'

import { formatPercentage } from '@/domain/common/format'
import { ReserveStatus } from '@/domain/market-info/reserve-status'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { APYDetails } from '@/features/markets/types'
import { Typography } from '@/ui/atoms/typography/Typography'
import { MobileViewOptions } from '@/ui/molecules/data-table/types'
import { cn } from '@/ui/utils/style'

import { testIds } from '@/ui/utils/testIds'
import { AirdropBadge } from '../../airdrop-badge/AirdropBadge'
import { RewardBadge } from '../../reward-badge/RewardBadge'

interface ApyWithRewardsCellProps extends VariantProps<typeof variants> {
  apyDetails: APYDetails
  reserveStatus: ReserveStatus
  incentivizedReserve: Token
  mobileViewOptions?: MobileViewOptions
  'data-testid'?: string
}

export function ApyWithRewardsCell({ mobileViewOptions, ...rest }: ApyWithRewardsCellProps) {
  if (mobileViewOptions?.isMobileView) {
    return (
      <div className="flex flex-row items-center justify-between">
        <Typography variant="prompt">{mobileViewOptions.rowTitle}</Typography>
        <CellContent {...rest} />
      </div>
    )
  }

  return <CellContent {...rest} />
}

type CellContentProps = Omit<ApyWithRewardsCellProps, 'mobileViewOptions'>

function CellContent({
  apyDetails,
  reserveStatus,
  incentivizedReserve,
  bold,
  'data-testid': dataTestId,
}: CellContentProps) {
  if (reserveStatus !== 'active') {
    return (
      <div className="flex items-center justify-end gap-1.5" data-testid={dataTestId}>
        <CellValue value={apyDetails.apy} dimmed bold={bold} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1 lg:gap-1.5" data-testid={dataTestId}>
      {apyDetails.airdrops.map((airdroppedToken) => (
        <AirdropBadge key={airdroppedToken} data-testid={testIds.markets.airdropBadge} />
      ))}
      {apyDetails.incentives.map((reward, index) => (
        <RewardBadge
          key={index}
          rewardToken={reward.token.symbol}
          rewardApr={reward.APR}
          incentivizedReserve={incentivizedReserve.symbol}
          data-testid={testIds.markets.rewardBadge}
        />
      ))}
      <CellValue value={apyDetails.apy} bold={bold} />
    </div>
  )
}

interface CellValueProps extends VariantProps<typeof variants> {
  value: Percentage | undefined
  dimmed?: boolean
}

function CellValue({ value, bold, dimmed }: CellValueProps) {
  return <div className={cn(variants({ bold: value && bold, dimmed }))}>{formatPercentage(value)}</div>
}

const variants = cva('', {
  variants: {
    bold: {
      true: 'font-bold',
    },
    dimmed: {
      true: 'text-secondary/70',
    },
  },
})
