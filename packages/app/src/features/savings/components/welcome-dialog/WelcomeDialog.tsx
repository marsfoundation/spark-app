import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { KeyPoints } from '@/ui/atoms/key-points/KeyPoints'

export interface WelcomeDialogProps {
  open: boolean
  apyDifference: Percentage
  setOpen: () => void
  onConfirm: () => void
}

export function WelcomeDialog({ open, setOpen, onConfirm, apyDifference }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col overflow-hidden p-0">
        <img src={assets.banners.newSavingsWelcome} alt="new-savings-welcome-banner" className="h-[300px]" />
        <div className="flex flex-col gap-6 px-10 py-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-basics-black text-xl">Welcome USDS, the new upgraded DAI!</h2>
            <p className="text-basics-dark-grey text-sm">
              USDS is the new version of DAI, the stablecoin that powers the Sky ecosystem. Upgrading to USDS unlocks
              additional benefits, providing you with more opportunities to earn rewards within the ecosystem. The
              upgrade is optional, and you can continue using DAI if you prefer.
            </p>
          </div>
          <KeyPoints>
            <KeyPoints.Item variant="positive">Use USDS to farm other tokens</KeyPoints.Item>
            <KeyPoints.Item variant="positive">
              <div>
                sUSDS has <span className="text-basics-green">{formatPercentage(apyDifference)} higher APY</span>{' '}
                compared to sDAI
              </div>
            </KeyPoints.Item>
          </KeyPoints>
          <Button onClick={onConfirm}>Cool!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
