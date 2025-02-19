import { Token } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { AmountCell } from '@/ui/molecules/data-table/components/AmountCell'
import { TokenCell } from '@/ui/molecules/data-table/components/TokenCell'
import { Info } from '@/ui/molecules/info/Info'
import { ResponsiveDataTable } from '@/ui/organisms/responsive-data-table/ResponsiveDataTable'
import { AlertTriangleIcon } from 'lucide-react'
import { ActiveRewardsQueryResult } from '../../types'

export interface ActiveRewardsPanelProps {
  activeRewardsQueryResult: ActiveRewardsQueryResult
  openClaimDialog: (reward: Token) => void
}

export function ActiveRewardsPanel({ activeRewardsQueryResult, openClaimDialog }: ActiveRewardsPanelProps) {
  if (activeRewardsQueryResult.isPending) {
    return <PendingPanel />
  }

  if (activeRewardsQueryResult.isError) {
    return <ErrorPanel />
  }

  return (
    <Panel spacing="m" className="flex flex-col gap-6">
      <Header />
      <ResponsiveDataTable
        gridTemplateColumnsClassName="grid-cols-[2fr_1fr_1fr_1fr]"
        data={activeRewardsQueryResult.data}
        columnDefinition={{
          token: {
            header: 'Reward',
            renderCell: ({ token }) => <TokenCell token={token} />,
          },
          amountPending: {
            header: 'Pending',
            headerAlign: 'right',
            renderCell: ({ amountPending, token }, mobileViewOptions) => (
              <AmountCell
                token={token}
                amount={amountPending}
                mobileViewOptions={mobileViewOptions}
                formattingOptions={{
                  zeroAmountHandling: 'show-zero',
                  showUsdValue: token.unitPriceUsd.isGreaterThan(0),
                }}
              />
            ),
          },
          amountToClaim: {
            header: 'Available to claim',
            headerAlign: 'right',
            renderCell: ({ amountToClaim, token }, mobileViewOptions) => (
              <AmountCell
                token={token}
                amount={amountToClaim}
                mobileViewOptions={mobileViewOptions}
                formattingOptions={{
                  zeroAmountHandling: 'show-zero',
                  showUsdValue: token.unitPriceUsd.isGreaterThan(0),
                }}
              />
            ),
          },
          actions: {
            header: '',
            renderCell: ({ token, amountToClaim }) => {
              return (
                <div className="flex justify-end sm:pl-6">
                  <Button
                    variant="secondary"
                    size="s"
                    disabled={amountToClaim.eq(0)}
                    onClick={() => openClaimDialog(token)}
                    className="w-full"
                  >
                    Claim
                  </Button>
                </div>
              )
            },
          },
        }}
      />
    </Panel>
  )
}

// @todo: Rewards - ask for tooltip text
function Header() {
  return (
    <h3 className="typography-heading-5 flex items-baseline gap-1">
      Active rewards <Info>Tooltip text</Info>
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
          <AlertTriangleIcon className="icon-xs" /> Failed to load active rewards data
        </div>
      </div>
    </Panel>
  )
}
