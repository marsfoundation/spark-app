import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { KeyPoints } from '@/features/dialogs/migrate/common/components/KeyPoints'
import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { Link } from '@/ui/atoms/link/Link'
import { cn } from '@/ui/utils/style'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export interface BenefitsDialog {
  portalContainer?: HTMLElement | null
  apyImprovement?: Percentage
}

export function BenefitsDialog({ portalContainer, apyImprovement }: BenefitsDialog) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="icon">
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')} />
        </Button>
      </DialogTrigger>
      <DialogContent
        portalContainer={portalContainer}
        overlayVariant="light"
        className="top-[100%] translate-y-[-100%]"
      >
        <div className="flex flex-col gap-6 p-1">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-basics-black text-xl">Deposit into Savings USDS</h2>
            <p className="text-basics-dark-grey text-sm">
              Deposit your stablecoins into Savings USDS to tap into the Sky Savings Rate, which grants you a
              predictable APY in USDS. {/* @todo: add proper link to docs when ready */}
              <Link to="/" external>
                Learn more
              </Link>
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
