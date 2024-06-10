import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token, USD_MOCK_TOKEN } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { assert } from '@/utils/assert'

export interface RouteItem {
  token: Token
  value: NormalizedUnitNumber
  usdValue: NormalizedUnitNumber
}

export interface MakerTransactionOverviewProps {
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
  route: RouteItem[]
  makerBadgeToken: Token
}

export function MakerTransactionOverview({ APY, daiEarnRate, route, makerBadgeToken }: MakerTransactionOverviewProps) {
  assert(route.length > 0, 'Route must have at least one item')
  const outcome = route.at(-1)!

  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <MakerTransactionOverviewDetailsItem label="APY">
        <APYDetails APY={APY} daiEarnRate={daiEarnRate} />
      </MakerTransactionOverviewDetailsItem>
      <MakerTransactionOverviewDetailsItem label="Route">
        <div className="flex flex-col items-start gap-2 md:flex-row">
          {route.map((item, index) => (
            <RouteItem key={item.token.symbol} item={item} isLast={index === route.length - 1} />
          ))}
        </div>
        <MakerBadge token={makerBadgeToken} />
      </MakerTransactionOverviewDetailsItem>
      <MakerTransactionOverviewDetailsItem label="Outcome">
        <MakerTransactionOutcome outcome={outcome} />
      </MakerTransactionOverviewDetailsItem>
    </DialogPanel>
  )
}

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
})

function MakerTransactionOverviewDetailsItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between border-b py-4 last:border-0 last:pb-0">
      <div className="text-basics-black">{label}</div>
      <div className="flex flex-col items-end gap-3.5">{children}</div>
    </div>
  )
}

function APYDetails({ APY, daiEarnRate }: { APY: Percentage; daiEarnRate: NormalizedUnitNumber }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div>{formatPercentage(APY)}</div>
      <div className="text-basics-dark-grey text-sm">Earn ~{formatter.format(daiEarnRate.toNumber())} DAI per year</div>
    </div>
  )
}

function RouteItem({ item, isLast }: { item: RouteItem; isLast: boolean }) {
  return (
    <div className={cn('grid grid-cols-1 items-center gap-x-2 gap-y-0.5', !isLast && 'md:grid-cols-[auto_auto]')}>
      <div>
        {item.token.format(item.value, { style: 'auto' })} {item.token.symbol}
      </div>
      <div className="justify-self-end text-basics-dark-grey text-sm md:order-last">
        {USD_MOCK_TOKEN.formatUSD(item.usdValue)}
      </div>
      {!isLast && (
        <img src={assets.arrowRight} className="mt-1.5 h-3.5 w-3.5 rotate-90 justify-self-center md:mt-0 md:rotate-0" />
      )}
    </div>
  )
}

function MakerBadge({ token }: { token: Token }) {
  return (
    <div className="flex flex-row items-center gap-1.5 rounded-lg bg-emerald-300/10 px-2.5 py-1.5 text-emerald-400 text-sm">
      <img src={assets.makerLogo} className="h-5 w-5" />
      <span>
        <span className="hidden font-medium md:inline"> Powered by Maker. </span>
        <span className="font-light">No slippage & fees for {token.symbol}.</span>
      </span>
      <Info className="text-inherit">The transaction uses Maker infrastructure without any third-parties.</Info>
    </div>
  )
}

function MakerTransactionOutcome({ outcome }: { outcome: RouteItem }) {
  return (
    <div className="flex flex-col items-end gap-0.5 md:block">
      <span>
        {outcome.token.format(outcome.value, { style: 'auto' })} {outcome.token.symbol}
      </span>
      <span> worth </span>
      <span className="font-semibold">{USD_MOCK_TOKEN.formatUSD(outcome.usdValue)}</span>
    </div>
  )
}
