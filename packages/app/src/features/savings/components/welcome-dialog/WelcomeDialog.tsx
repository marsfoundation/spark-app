import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { KeyPoints } from '@/ui/atoms/key-points/KeyPoints'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'

export interface WelcomeDialogProps {
  open: boolean
  apyImprovement?: Percentage
  onConfirm: () => void
}

export function WelcomeDialog({ open, onConfirm, apyImprovement }: WelcomeDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col p-0" showCloseButton={false}>
        <img
          src={assets.banners.newSavingsWelcome}
          width={600}
          height={300}
          alt="new-savings-welcome-banner"
          className="w-fit md:max-h-[300px]"
        />
        <div className="flex flex-col gap-6 px-10 py-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-xl">Welcome USDS, the new upgraded DAI!</h2>
            <p className="text-basics-dark-grey text-sm sm:w-[58ch]">
              USDS is the new version of DAI, the stablecoin that powers the Sky ecosystem. Upgrading to USDS unlocks
              additional benefits, providing you with more opportunities to earn rewards within the ecosystem. The
              upgrade is optional, and you can continue using DAI if you prefer.{' '}
              <Link to={links.docs.newSavings} external>
                Learn more
              </Link>
            </p>
          </div>
          <KeyPoints>
            <KeyPoints.Item variant="positive">Use USDS to farm other tokens</KeyPoints.Item>
            {apyImprovement && (
              <KeyPoints.Item variant="positive">
                <div>
                  <span className="text-basics-green">{formatPercentage(apyImprovement)} higher APY</span> compared to
                  Savings DAI
                </div>
              </KeyPoints.Item>
            )}
          </KeyPoints>
          <Button onClick={onConfirm}>Cool!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
