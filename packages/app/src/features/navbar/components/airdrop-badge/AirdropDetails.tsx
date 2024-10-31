import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Link } from '@/ui/atoms/link/Link'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { links } from '@/ui/constants/links'
import { formatAirdropAmount } from './utils/formatAirdropAmount'

interface AirdropDetailsProps {
  amount: NormalizedUnitNumber
  precision: number
  isGrowing?: boolean
  isLoading?: boolean
}

export function AirdropDetails({ amount, precision, isLoading, isGrowing }: AirdropDetailsProps) {
  return (
    <div className="flex w-[calc(100vw-48px)] flex-col text-basics-dark-grey text-xs lg:w-auto">
      <div className="flex flex-col gap-1 border-basics-grey/50 border-b p-4">
        LAST points
        <div className="flex items-center gap-2">
          <img src={assets.lastLogo} className="h-7 lg:h-6" />
          {isLoading ? (
            <Skeleton className="h-5 w-7" />
          ) : (
            <div className="font-semibold text-base tabular-nums" data-chromatic="ignore">
              {formatAirdropAmount({ amount, precision, isGrowing })} {SPK_MOCK_TOKEN.symbol}
            </div>
          )}
        </div>
      </div>
      <div className="flex max-w-60 flex-col gap-2 p-4">
        DAI borrowers with volatile assets and ETH depositors will be eligible for a future LAST points airdrop.
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
