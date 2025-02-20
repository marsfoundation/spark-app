import { assets } from '@/ui/assets'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { ExternalLinkIcon } from 'lucide-react'

// @todo: Rewards: Ask for copy and button link
export function GuestModePanel() {
  return (
    <Panel
      spacing="none"
      className={cn(
        'bg-[url(/src/ui/assets/rewards/guest-mode-panel-bg.svg)]',
        'flex flex-col gap-3 bg-cover bg-primary-inverse bg-no-repeat',
      )}
    >
      <img src={assets.rewards.guestModePanelIcon} className="w-full" alt="Earn Spark Rewards icon" />
      <div className="flex flex-col gap-6 p-3 text-center sm:gap-10 sm:p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <div className="typography-heading-3 text-primary-inverse">Earn Spark Rewards</div>
          <div className="typography-body-3 text-tertiary">
            Lorem ipsum dolor sit amet consectetur. Ultrices senectus dignissim dui varius porta curabitur. Cursus odio
            lobortis ut erat habitant ac tellus. Posuere eget tellus tellus maecenas consectetur habitasse massa.{' '}
          </div>
        </div>
        <LinkButton variant="secondary" size="l" className="w-full" to="/">
          Learn more <ExternalLinkIcon className="icon-sm" />
        </LinkButton>
      </div>
    </Panel>
  )
}
