import { getChainConfigEntry } from '@/config/chain'
import { assets, getSocialPlatformIcon, getTokenImage } from '@/ui/assets'
import { Button, ButtonProps } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Tooltip, TooltipContent, TooltipTrigger, isTouchScreen } from '@/ui/atoms/tooltip/Tooltip'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import { AlertTriangleIcon, ChevronDownIcon } from 'lucide-react'
import { UseOngoingCampaignsResult } from '../../logic/useOngoingCampaigns'
import { OngoingCampaignRow } from '../../types'

export interface OngoingCampaignsPanelProps {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  isGuestMode: boolean
  className?: string
}

export function OngoingCampaignsPanel({ ongoingCampaignsResult, isGuestMode, className }: OngoingCampaignsPanelProps) {
  if (ongoingCampaignsResult.isPending) {
    return <PendingPanel className={className} />
  }

  if (ongoingCampaignsResult.isError) {
    return <ErrorPanel className={className} />
  }

  if (ongoingCampaignsResult.data.length === 0) {
    return <NoCampaigns className={className} />
  }

  return (
    <Panel spacing="m" className={cn('flex flex-col gap-6', className)}>
      <Header />
      <Accordion type="multiple">
        <div className="typography-label-4 flex items-center justify-between gap-6 pb-2 text-secondary">
          <div>Task</div>
          <div className="hidden sm:mr-8 sm:block">Action</div>
        </div>
        {ongoingCampaignsResult.data.map((campaign, index) => (
          <AccordionItem
            key={campaign.id}
            value={campaign.id}
            className="border-primary border-t"
            data-testid={testIds.sparkRewards.ongoingCampaignsPanel.row(index)}
          >
            <AccordionTrigger
              className={cn(
                'grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 py-6',
                'sm:grid-cols-[auto_1fr_auto_auto] [&[data-state=open]>svg]:rotate-180',
                'focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring',
                'focus-visible:ring-primary-200 focus-visible:ring-offset-0',
                isGuestMode && 'sm:grid-cols-[auto_1fr_auto]',
              )}
            >
              <IconStack {...getStackIcons(campaign)} size="base" iconBorder="white" />
              <Title campaign={campaign} />
              {!isGuestMode && <EngagementButton className="hidden sm:block" onClick={campaign.onEngageButtonClick} />}
              <ChevronDownIcon className="icon-secondary icon-sm transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
                'overflow-hidden transition-all',
              )}
            >
              <div className="flex flex-col gap-4 pb-6">
                <div className="flex flex-col gap-2">
                  <div className="typography-body-4 text-primary sm:hidden">{campaign.shortDescription}</div>
                  <div className="typography-body-4 max-w-[72ch] text-secondary">{campaign.longDescription}</div>
                </div>
                {!isGuestMode && (
                  <EngagementButton className="w-full sm:hidden" onClick={campaign.onEngageButtonClick} />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Panel>
  )
}

function Header() {
  return (
    <h3 className="typography-heading-5 flex items-baseline gap-1">
      Earn rewards
      <Info>
        Earn rewards by participating in the following incentivized actions and campaigns. Explore available
        opportunities and start accumulating rewards!
      </Info>
    </h3>
  )
}

function NoCampaigns({ className }: { className?: string }) {
  const icons = [assets.page.savingsCircle, assets.page.farmsCircle, assets.page.borrowCircle]
  return (
    <Panel spacing="m" className={cn('flex min-h-60 flex-col gap-9 sm:min-h-72', className)}>
      <div className="my-auto flex flex-col items-center gap-5">
        <IconStack size="lg" items={icons} iconBorder="white" />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="typography-heading-5 text-primary">No active rewards programs right now</div>
          <div className="typography-body-3 max-w-[36ch] text-secondary">
            Don't miss out when they launch. Follow our socials for announcements and updates.
          </div>
        </div>
      </div>
    </Panel>
  )
}

export function PendingPanel({ className }: { className?: string }) {
  return (
    <Panel spacing="m" className={cn('flex min-h-60 flex-col gap-8 sm:min-h-72', className)}>
      <Skeleton className="h-6 w-28" />
      <div className="flex flex-col gap-5">
        <Skeleton className="h-4 w-44" />
        <div className="flex flex-col gap-7">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Panel>
  )
}

function ErrorPanel({ className }: { className?: string }) {
  return (
    <Panel spacing="m" className={cn('flex min-h-60 flex-col sm:min-h-72', className)}>
      <div className="my-auto flex items-center justify-center">
        <div className="typography-label-3 flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary/80">
          <AlertTriangleIcon className="icon-xs" />
          Failed to load ongoing campaigns data
        </div>
      </div>
    </Panel>
  )
}

function Title({ campaign }: { campaign: OngoingCampaignRow }) {
  const [ref, isTruncated] = useIsTruncated()

  if (isTouchScreen()) {
    return <div className="typography-label-2 truncate text-left">{campaign.shortDescription}</div>
  }

  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <div className="typography-label-2 truncate text-left" ref={ref}>
          {campaign.shortDescription}
        </div>
      </TooltipTrigger>
      <TooltipContent>{campaign.shortDescription}</TooltipContent>
    </Tooltip>
  )
}

function EngagementButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="secondary"
      size="s"
      className={cn(props.className, 'px-6')}
      data-testid={testIds.sparkRewards.ongoingCampaignsPanel.startButton}
      onClick={(e) => {
        e.stopPropagation()
        props.onClick?.(e)
      }}
    >
      Start
    </Button>
  )
}

function getStackIcons(campaign: OngoingCampaignRow): { items: string[]; subIcon: string | undefined } {
  // social platforms
  const socialPlatformIcon =
    campaign.type === 'social' && campaign.platform ? getSocialPlatformIcon(campaign.platform) : undefined
  // tokens
  const tokens = [...campaign.involvedTokensSymbols, campaign.rewardTokenSymbol]
  const tokenIcons = tokens.map((token) => getTokenImage(token))
  // chains
  const chainId = 'chainId' in campaign && campaign.chainId
  const chainIcon = chainId ? getChainConfigEntry(chainId).meta.logo : undefined
  return { items: [socialPlatformIcon, ...tokenIcons].filter(Boolean), subIcon: chainIcon }
}
