import { assets } from '@/ui/assets'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { links } from '@/ui/constants/links'
import { cn } from '@/ui/utils/style'
import { ExternalLinkIcon } from 'lucide-react'

export interface EarnRewardsBannerProps {
  className?: string
}

export function EarnRewardsBanner({ className }: EarnRewardsBannerProps) {
  return (
    <Panel
      spacing="none"
      className={cn(
        'bg-[url(/src/ui/assets/rewards/guest-mode-panel-bg.svg)]',
        'flex flex-col gap-3 bg-cover bg-primary-inverse bg-no-repeat',
        className,
      )}
    >
      <img src={assets.rewards.guestModePanelIcon} className="w-full" alt="Earn Spark Rewards icon" />
      <div className="flex flex-col gap-6 p-3 text-center sm:gap-10 sm:p-4 md:p-6">
        <div className="flex flex-col gap-2">
          <div className="typography-heading-3 text-primary-inverse">Earn Spark Rewards</div>
          <div className="typography-body-3 text-tertiary">
            Earn rewards by participating in campaigns. Rewards accrue in real time and are distributed periodically,
            powered by strategic partnerships. Start earning today!
          </div>
        </div>
        <LinkButton external to={links.docs.sparkRewards} variant="secondary" size="l" className="w-full">
          Learn more <ExternalLinkIcon className="icon-sm" />
        </LinkButton>
      </div>
    </Panel>
  )
}
