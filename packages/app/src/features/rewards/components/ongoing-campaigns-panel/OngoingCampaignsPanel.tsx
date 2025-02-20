import { getChainConfigEntry } from '@/config/chain'
import { getTokenImage } from '@/ui/assets'
import { Accordion, AccordionItem } from '@/ui/atoms/accordion/Accordion'
import { Button, ButtonProps } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { useIsTruncated } from '@/ui/utils/useIsTruncated'
import { Content, Trigger } from '@radix-ui/react-accordion'
import { AlertTriangleIcon, ChevronDownIcon } from 'lucide-react'
import { mainnet } from 'viem/chains'
import { OngoingCampaign, OngoingCampaignsQueryResult } from '../../types'

export interface OngoingCampaignsPanelProps {
  ongoingCampaignsQueryResult: OngoingCampaignsQueryResult
}

export function OngoingCampaignsPanel({ ongoingCampaignsQueryResult }: OngoingCampaignsPanelProps) {
  if (ongoingCampaignsQueryResult.isPending) {
    return <PendingPanel />
  }

  if (ongoingCampaignsQueryResult.isError) {
    return <ErrorPanel />
  }

  return (
    <Panel spacing="m" className="flex flex-col gap-6">
      <Header />
      <Accordion type="multiple" className="grid grid-cols-[auto_1fr_auto] gap-x-3 sm:grid-cols-[auto_1fr_auto_auto]">
        {ongoingCampaignsQueryResult.data.map((campaign) => (
          <AccordionItem key={campaign.id} value={campaign.id} className="col-span-full grid grid-cols-subgrid">
            <Trigger className="col-span-full grid grid-cols-subgrid items-center py-6 [&[data-state=open]>svg]:rotate-180">
              <IconStack
                items={getStackIcons(campaign)}
                size="base"
                iconBorder={{ borderColorClass: 'border-base-white' }}
              />
              <Title campaign={campaign} />
              {/* @todo: Rewards: Add onclick logic */}
              <EngagementButton className="hidden sm:block" onClick={() => {}} />
              <ChevronDownIcon className="icon-secondary icon-sm transition-transform duration-200" />
            </Trigger>
            <Content
              className={cn(
                'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
                '-mt-2 col-span-full overflow-hidden transition-all',
              )}
            >
              <div className="flex flex-col gap-4 pb-6">
                <div className="typography-body-4 text-secondary">{campaign.longDescription}</div>
                <EngagementButton className="w-full sm:hidden" onClick={() => {}} />
              </div>
            </Content>
          </AccordionItem>
        ))}
      </Accordion>
    </Panel>
  )
}

// @todo: Rewards - ask for tooltip text
function Header() {
  return (
    <h3 className="typography-heading-5 flex items-baseline gap-1">
      Earn rewards <Info>Tooltip text</Info>
    </h3>
  )
}

function PendingPanel() {
  return (
    <Panel spacing="m" className="flex min-h-60 flex-col gap-9 sm:min-h-72">
      <Header />
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

function ErrorPanel() {
  return (
    <Panel spacing="m" className="flex min-h-60 flex-col sm:min-h-72">
      <Header />
      <div className="my-auto flex items-center justify-center">
        <div className="typography-label-3 flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary/80">
          <AlertTriangleIcon className="icon-xs" /> Failed to load ongoing campaigns data
        </div>
      </div>
    </Panel>
  )
}

function Title({ campaign }: { campaign: OngoingCampaign }) {
  const [ref, isTruncated] = useIsTruncated()

  return (
    <Tooltip open={!isTruncated ? false : undefined}>
      <TooltipTrigger asChild>
        <div className="typography-label-2 text-left" ref={ref}>
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
      onClick={(e) => {
        e.stopPropagation()
        props.onClick?.(e)
      }}
    >
      Engage
    </Button>
  )
}

function getStackIcons(campaign: OngoingCampaign): string[] {
  const tokens = [...campaign.involvedTokens, campaign.rewardToken]
  const tokenIcons = tokens.map((token) => getTokenImage(token.symbol))
  const chainId = 'chainId' in campaign && campaign.chainId !== mainnet.id ? campaign.chainId : undefined
  const chainIcon = chainId ? getChainConfigEntry(chainId).meta.logo : undefined
  return [...tokenIcons, chainIcon].filter(Boolean)
}
