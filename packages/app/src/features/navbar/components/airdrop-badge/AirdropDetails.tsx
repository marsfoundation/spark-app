import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Link } from '@/ui/atoms/link/Link'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { links } from '@/ui/constants/links'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { formatWithPrecision } from './utils/formatWithPrecision'

interface AirdropDetailsProps {
  amount: NormalizedUnitNumber
  isLoading?: boolean
}

export function AirdropDetails({ amount, isLoading }: AirdropDetailsProps) {
  return (
    <div className="flex flex-col text-basics-dark-grey text-xs">
      <div className="flex flex-col gap-1 border-basics-grey/50 border-b p-4">
        Spark Airdrop Tokens
        <div className="flex items-center gap-2">
          <img src={assets.sparkIcon} className="h-7 lg:h-6" />
          {isLoading ? (
            <Skeleton className="h-5 w-7" />
          ) : (
            <div className="font-semibold text-base text-basics-black tabular-nums">
              {formatWithPrecision(amount)} {SPK_MOCK_TOKEN.symbol}
            </div>
          )}
        </div>
      </div>
      <div className="flex max-w-60 flex-col gap-2 p-4">
        DAI borrowers with volatile assets and ETH depositors will be eligible for a future ⚡ SPK airdrop.
        <Link
          to={links.docs.sparkAirdrop}
          external
          className="flex items-center gap-2.5 font-medium text-basics-dark-grey text-sm"
        >
          <BoxArrowTopRight className="h-4 w-4" />
          Learn more
        </Link>
      </div>
    </div>
  )
}
