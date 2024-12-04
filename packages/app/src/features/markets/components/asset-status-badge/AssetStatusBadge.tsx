import { DownloadIcon, Layers3Icon, UploadIcon } from 'lucide-react'

import {
  BorrowEligibilityStatus,
  CollateralEligibilityStatus,
  SupplyAvailabilityStatus,
} from '@/domain/market-info/reserve-status'
import { IndicatorIcon } from '@/ui/atoms/indicator-icon/IndicatorIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { AssetStatusDescription } from './components/AssetStatusDescription'
import { getVariantFromStatus } from './getVariantFromStatus'

export interface AssetStatusBadgeProps {
  supplyStatus: SupplyAvailabilityStatus
  collateralStatus: CollateralEligibilityStatus
  borrowStatus: BorrowEligibilityStatus
  'data-testid'?: string
}

export function AssetStatusBadge({
  supplyStatus,
  collateralStatus,
  borrowStatus,
  'data-testid': dataTestId,
}: AssetStatusBadgeProps) {
  const supplyIcon = <IndicatorIcon icon={DownloadIcon} variant={getVariantFromStatus(supplyStatus)} />
  const collateralIcon = <IndicatorIcon icon={Layers3Icon} variant={getVariantFromStatus(collateralStatus)} />
  const borrowIcon = <IndicatorIcon icon={UploadIcon} variant={getVariantFromStatus(borrowStatus)} />

  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger className="py-2 md:py-0">
        <div className="inline-flex gap-3 rounded-xs border border-primary px-3 py-2 md:gap-2" data-testid={dataTestId}>
          {supplyIcon}
          {collateralIcon}
          {borrowIcon}
        </div>
      </TooltipTrigger>
      <TooltipContent variant="long">
        <div className="flex flex-col gap-1.5">
          <AssetStatusDescription>
            {supplyIcon}
            {supplyStatusDescription[supplyStatus]}
          </AssetStatusDescription>
          <AssetStatusDescription>
            {collateralIcon}
            {collateralStatusDescription[collateralStatus]}
          </AssetStatusDescription>
          <AssetStatusDescription>
            {borrowIcon}
            {borrowStatusDescription[borrowStatus]}
          </AssetStatusDescription>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

const supplyStatusDescription: Record<SupplyAvailabilityStatus, string> = {
  yes: 'Can be supplied',
  no: 'Cannot be supplied',
  'supply-cap-reached': 'Supply limit reached',
}

const collateralStatusDescription: Record<CollateralEligibilityStatus, string> = {
  yes: 'Can be used as collateral',
  no: 'Cannot be used as collateral',
  'only-in-isolation-mode': 'Can be used as collateral only in isolation mode',
}

const borrowStatusDescription: Record<BorrowEligibilityStatus, string> = {
  yes: 'Can be borrowed',
  no: 'Cannot be borrowed',
  'borrow-cap-reached': 'Borrow limit reached',
  'only-in-siloed-mode': 'Can be borrowed only in siloed mode',
}
