import { formatPercentage } from '@/domain/common/format'
import { assets } from '@/ui/assets'
import { Dialog, DialogContent } from '@/ui/atoms/dialog/Dialog'
import { KeyPoints } from '@/ui/atoms/key-points/KeyPoints'
import { Button } from '@/ui/atoms/new/button/Button'
import { Link } from '@/ui/atoms/new/link/Link'
import { links } from '@/ui/constants/links'
import { Percentage } from '@marsfoundation/common-universal'

export interface WelcomeDialogProps {
  open: boolean
  apyImprovement?: Percentage
  onConfirm: () => void
}

export function WelcomeDialog({ open, onConfirm, apyImprovement }: WelcomeDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} spacing="none" className="bg-reskin-base-black">
        <img
          src={assets.savings.savingsWelcome}
          width={686}
          height={341}
          alt="new-savings-welcome-banner"
          className=" w-full bg-cover bg-savings-welcome bg-no-repeat"
        />
        <div className="flex flex-col gap-8 p-4 sm:p-8">
          <h2 className="typography-heading-2 text-primary-inverse">Welcome USDS, the new upgraded DAI!</h2>
          <p className="typography-body-5 text-secondary">
            USDS is the new version of DAI, the stablecoin that powers the Sky ecosystem. Upgrading to USDS unlocks
            additional benefits, providing you with more opportunities to earn rewards within the ecosystem. The upgrade
            is optional, and you can continue using DAI if you prefer.{' '}
            <Link to={links.docs.newSavings} external>
              Learn more
            </Link>
          </p>
          <KeyPoints className="text-primary-inverse">
            <KeyPoints.Item variant="positive">Use USDS to farm other tokens</KeyPoints.Item>
            {apyImprovement && (
              <KeyPoints.Item variant="positive">
                <div>
                  <span className="text-system-success-primary">{formatPercentage(apyImprovement)} higher APY</span>{' '}
                  compared to Savings DAI
                </div>
              </KeyPoints.Item>
            )}
          </KeyPoints>
          <Button variant="primary" size="l" onClick={onConfirm}>
            Cool!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
