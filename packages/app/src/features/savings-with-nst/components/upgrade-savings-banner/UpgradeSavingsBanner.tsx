import { assets } from '@/ui/assets'
import { Button, LinkButton } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'

export interface UpgradeSavingsBannerProps {
  onUpgradeSavingsClick: () => void
}

export function UpgradeSavingsBanner({ onUpgradeSavingsClick }: UpgradeSavingsBannerProps) {
  return (
    <Panel.Wrapper
      className="flex min-h-[240px] w-full flex-1 flex-col justify-between gap-6 self-stretch px-6 py-6 md:gap-0 md:px-8"
      variant="blue"
    >
      <div className="flex flex-col gap-3">
        <h2 className="inline-block font-semibold text-base text-basics-black sm:text-xl">
          Upgrade sDAI to sNST and get more benefits!
        </h2>
        <div className="text-prompt-foreground">sNST is an upgraded stablecoin from MakerDAO's Endgame plan.</div>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-2">
        <div className="grid grid-cols-[auto_auto] gap-2">
          <div className="col-span-full grid grid-cols-subgrid">
            <img src={assets.success} alt="success-img" className="h-4 w-4 translate-y-1" />
            <div>
              Higher APY by <span className="text-product-green">0.25%</span>
            </div>
          </div>
          <div className="col-span-full grid grid-cols-subgrid">
            <img src={assets.success} alt="success-img" className="h-4 w-4 translate-y-1" />
            <div> More investment opportunities </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <Button onClick={onUpgradeSavingsClick}>Upgrade now</Button>
          <LinkButton variant="secondary" to="google.com">
            Learn more
          </LinkButton>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
