import { Token } from '@/domain/types/Token'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { isTokenImageAvailable } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Loader } from '@/ui/atoms/loader/Loader'
import { Panel } from '@/ui/atoms/panel/Panel'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { AlertTriangleIcon } from 'lucide-react'
import { ActiveReward, ActiveRewardsResult } from '../../logic/useActiveRewards'

export interface ClaimAllPanelProps {
  activeRewardsResult: ActiveRewardsResult
  onClaimAll: () => void
  className?: string
}

export function ClaimAllPanel({ activeRewardsResult, onClaimAll, className }: ClaimAllPanelProps) {
  if (activeRewardsResult.isPending) {
    return <PendingPanel className={className} />
  }

  if (activeRewardsResult.isError) {
    return <ErrorPanel className={className} />
  }

  const tokensToClaim = activeRewardsResult.data

  const nonZeroPriceTokens = tokensToClaim.filter(({ token, amountToClaim }) => token.toUSD(amountToClaim).gt(0))
  const zeroPriceClaimableTokens = tokensToClaim.filter(
    ({ token, amountToClaim }) => amountToClaim.isGreaterThan(0) && token.toUSD(amountToClaim).eq(0),
  )

  const usdSum = nonZeroPriceTokens.reduce((acc, { token, amountToClaim }) => {
    return NormalizedUnitNumber(acc.plus(token.toUSD(amountToClaim)))
  }, NormalizedUnitNumber(0))

  return (
    <MainPanel className={className}>
      {usdSum.gt(0) && (
        <SubPanel>
          <div className="flex items-center gap-1">
            <div className="typography-label-2 text-tertiary">Total to claim</div>
            <Info>Sum of all rewards available to claim in USD.</Info>
          </div>
          <div className="flex items-center gap-2">
            <div className="typography-heading-2 text-primary-inverse">{USD_MOCK_TOKEN.formatUSD(usdSum)}</div>
            <IconStack size="m" items={nonZeroPriceTokens.map(({ token }) => token)} />
          </div>
          <div className="flex flex-col gap-2">
            {zeroPriceClaimableTokens.map(({ token, amountToClaim }) => (
              <div key={token.symbol} className="typography-label-2 flex items-center gap-1 text-tertiary">
                +{token.format(amountToClaim, { style: 'compact' })}{' '}
                <TokenIconOrSymbol token={token} iconClassName="size-4" />
              </div>
            ))}
          </div>
        </SubPanel>
      )}
      {usdSum.eq(0) && (
        <SubPanel>
          <div className="flex items-center gap-1">
            <div className="typography-label-2 text-tertiary">Total to claim</div>
            <Info>All tokens you can claim.</Info>
          </div>
          {zeroPriceClaimableTokens.length === 1 ? (
            <OneTokenWithoutPrice tokens={zeroPriceClaimableTokens} />
          ) : (
            <MultipleTokensWithoutPrice tokens={zeroPriceClaimableTokens} />
          )}
        </SubPanel>
      )}
      <Actions claim={{ onAction: onClaimAll }} />
    </MainPanel>
  )
}

function PendingPanel({ className }: { className?: string }) {
  return (
    <MainPanel className={className}>
      <SubPanel>
        <Loader size={20} />
      </SubPanel>
      <Actions claim={{ isPending: true }} />
    </MainPanel>
  )
}

function ErrorPanel({ className }: { className?: string }) {
  return (
    <MainPanel className={className}>
      <SubPanel>
        <div className="typography-label-3 flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary/80">
          <AlertTriangleIcon className="icon-xs" /> Failed to load rewards data
        </div>
      </SubPanel>
      <Actions claim={{ isDisabled: true }} />
    </MainPanel>
  )
}

interface ActionsProps {
  claim: {
    onAction?: () => void
    isPending?: boolean
    isDisabled?: boolean
  }
}
function Actions({ claim }: ActionsProps) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Button
        variant="primary"
        className="w-full"
        onClick={claim.onAction}
        disabled={claim.isDisabled}
        loading={claim.isPending}
      >
        Claim all
      </Button>
    </div>
  )
}

function MainPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Panel variant="secondary" spacing="none" className={cn('rounded-md p-2', className)}>
      {children}
    </Panel>
  )
}

function SubPanel({ children }: { children: React.ReactNode }) {
  return (
    <Panel
      variant="quaternary"
      spacing="none"
      className="flex min-h-[164px] flex-col items-center justify-center gap-3 py-12 md:min-h-[174px]"
    >
      {children}
    </Panel>
  )
}

function OneTokenWithoutPrice({ tokens }: { tokens: ActiveReward[] }) {
  const { token, amountToClaim } = tokens[0] ?? raise('No token to display')

  return (
    <div className="typography-heading-2 flex items-center gap-2 text-primary-inverse">
      <div>{token.format(amountToClaim, { style: 'compact' })}</div>
      <TokenIconOrSymbol token={token} iconClassName="size-6 md:size-8" />
    </div>
  )
}

function MultipleTokensWithoutPrice({ tokens }: { tokens: ActiveReward[] }) {
  return (
    <div className="flex flex-col gap-2">
      {tokens.map(({ token, amountToClaim }) => (
        <div key={token.symbol} className="typography-heading-4 flex items-center gap-1 text-primary-inverse">
          {token.format(amountToClaim, { style: 'compact' })}{' '}
          <TokenIconOrSymbol token={token} iconClassName="size-4 md:size-6" />
        </div>
      ))}
    </div>
  )
}

function TokenIconOrSymbol({ token, iconClassName }: { token: Token; iconClassName?: string }) {
  return isTokenImageAvailable(token.symbol) ? <TokenIcon token={token} className={iconClassName} /> : token.symbol
}
