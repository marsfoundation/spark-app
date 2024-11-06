import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { KeyPoints } from '@/ui/atoms/key-points/KeyPoints'
import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { ChevronDown } from 'lucide-react'
import { RefObject, useState } from 'react'

export interface BenefitsDialog {
  portalContainerRef: RefObject<HTMLElement> | undefined
  apyImprovement?: Percentage
}

export function BenefitsDialog({ portalContainerRef, apyImprovement }: BenefitsDialog) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          size="m"
          variant="transparent"
          icon={ChevronDown}
          className={cn('transition-transform duration-300', open && 'rotate-180')}
          data-testid={testIds.dialog.savings.upgradeDetailsTrigger}
        />
      </DialogTrigger>
      <DialogContent portalContainerRef={portalContainerRef} overlayVariant="delicate" contentVerticalPosition="bottom">
        <div className="flex flex-col gap-6 p-1">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-basics-black text-xl">Deposit into Savings USDS</h2>
            <p className="text-basics-dark-grey text-sm">
              By enabling this option, you will be depositing your stablecoins into Savings USDS, thus accessing the SSR
              (Sky Savings Rate), which provides the highest predictable rate in USDS. You can exit Savings USDS at any
              time at your sole discretion.
            </p>
          </div>
          <KeyPoints>
            {apyImprovement && (
              <KeyPoints.Item variant="positive">
                <div>
                  <span className="text-basics-green">{formatPercentage(apyImprovement)} higher APY</span> compared to
                  Savings DAI
                </div>
              </KeyPoints.Item>
            )}
            <KeyPoints.Item variant="positive">You can exit Savings USDS at any time</KeyPoints.Item>
          </KeyPoints>
        </div>
      </DialogContent>
    </Dialog>
  )
}
