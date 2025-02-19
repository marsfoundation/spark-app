import { Token } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { DataTableColumnDefinitions } from '@/ui/molecules/data-table/DataTable'
import { AmountCell } from '@/ui/molecules/data-table/components/AmountCell'
import { TokenCell } from '@/ui/molecules/data-table/components/TokenCell'
import { ResponsiveDataTable } from '@/ui/organisms/responsive-data-table/ResponsiveDataTable'
import { useMemo } from 'react'
import { ActiveReward } from '../../types'

export interface ActiveRewardsPanelProps {
  rewards: ActiveReward[]
  openClaimDialog: (reward: Token) => void
}

export function ActiveRewardsPanel({ rewards, openClaimDialog }: ActiveRewardsPanelProps) {
  const columnDef: DataTableColumnDefinitions<ActiveReward> = useMemo(
    () => ({
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
            formattingOptions={{ priceUnavailablePlaceholder: '', zeroAmountHandling: 'show-zero' }}
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
            formattingOptions={{ priceUnavailablePlaceholder: '', zeroAmountHandling: 'show-zero' }}
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
    }),
    [openClaimDialog],
  )

  return (
    <Panel spacing="m" className="flex flex-col gap-6">
      <h3 className="typography-heading-4 text-primary">Active rewards</h3>
      <ResponsiveDataTable
        gridTemplateColumnsClassName="grid-cols-[2fr_1fr_1fr_1fr]"
        data={rewards}
        columnDefinition={columnDef}
      />
    </Panel>
  )
}
