import { formatPercentage } from '@/domain/common/format'
import { FarmDetailsRowData } from '@/domain/farms/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Info } from '@/ui/molecules/info/Info'

export interface FarmDetailsRowProps {
  farmDetailsRowData: FarmDetailsRowData
}

export function FarmDetailsRow({ farmDetailsRowData }: FarmDetailsRowProps) {
  const { depositors, tvl, apy } = farmDetailsRowData

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-12">
      <DetailsItem title="Addresses" explainer="Number of addresses that have deposited in the farm">
        <div className="font-semibold">{depositors}</div>
      </DetailsItem>
      <DetailsItem title="TVL" explainer="Total value locked in the farm">
        <div className="font-semibold">{USD_MOCK_TOKEN.formatUSD(tvl)}</div>
      </DetailsItem>
      <DetailsItem title="APY" explainer="Annual percentage yield">
        <div className="font-semibold text-[#3F66EF]">{formatPercentage(apy, { minimumFractionDigits: 0 })}</div>
      </DetailsItem>
    </div>
  )
}

export interface DetailsItemProps {
  title: string
  explainer: string
  children: React.ReactNode
}
function DetailsItem({ title, explainer, children }: DetailsItemProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-1 md:w-fit md:flex-col md:items-start md:justify-normal">
      <div className="flex flex-row items-center gap-1 text-prompt-foreground text-xs">
        {title}
        <Info>{explainer}</Info>
      </div>
      <div>{children}</div>
    </div>
  )
}
