import { sortByAPY, sortByUsdValue } from '@/domain/common/sorters'
import { EModeCategoryId } from '@/domain/e-mode/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { borrowDialogConfig } from '@/features/dialogs/borrow/BorrowDialog'
import { eModeDialogConfig } from '@/features/dialogs/e-mode/EModeDialog'
import { repayDialogConfig } from '@/features/dialogs/repay/RepayDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { ActionsCell } from '@/ui/molecules/data-table/components/ActionsCell'
import { CompactValueCell } from '@/ui/molecules/data-table/components/CompactValueCell'
import { PercentageCell } from '@/ui/molecules/data-table/components/PercentageCell'
import { TokenWithLogo } from '@/ui/molecules/data-table/components/TokenWithLogo'
import { ResponsiveDataTable } from '@/ui/organisms/responsive-data-table/ResponsiveDataTable'
import { Borrow } from '../../logic/assets'
import { EModeIndicator } from './components/EModeIndicator'

export interface BorrowTableProps {
  assets: Borrow[]
  openDialog: OpenDialogFunction
  eModeCategoryId: EModeCategoryId
  interactive: boolean
}

export function BorrowTable({ assets, openDialog, eModeCategoryId, interactive }: BorrowTableProps) {
  return (
    <Panel collapsibleOptions={{ collapsible: true, collapsibleAbove: 'md' }}>
      <Panel.Header>
        <Panel.Title>Borrow</Panel.Title>
        <EModeIndicator
          eModeCategoryId={eModeCategoryId}
          onButtonClick={() => {
            openDialog(eModeDialogConfig, { userEModeCategoryId: eModeCategoryId })
          }}
        />
      </Panel.Header>

      <Panel.Content>
        <ResponsiveDataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(4,_1fr)_2fr]"
          columnDefinition={{
            symbol: {
              header: 'Assets',
              renderCell: ({ token, reserveStatus }) => <TokenWithLogo token={token} reserveStatus={reserveStatus} />,
            },
            inWallet: {
              header: 'Available',
              sortable: true,
              sortingFn: (a, b) => sortByUsdValue(a.original, b.original, 'available'),
              headerAlign: 'right',
              renderCell: ({ token, available }, mobileViewOptions) => (
                <CompactValueCell token={token} value={available} mobileViewOptions={mobileViewOptions} hideEmpty />
              ),
            },
            deposit: {
              header: 'Your borrow',
              sortable: true,
              sortingFn: (a, b) => sortByUsdValue(a.original, b.original, 'debt'),
              headerAlign: 'right',
              renderCell: ({ token, debt }, mobileViewOptions) => (
                <CompactValueCell token={token} value={debt} mobileViewOptions={mobileViewOptions} hideEmpty />
              ),
            },
            apy: {
              header: <ApyTooltip variant="borrow">APY</ApyTooltip>,
              headerAlign: 'right',
              sortable: true,
              sortingFn: (a, b) => sortByAPY(a.original.borrowAPY, b.original.borrowAPY),
              renderCell: ({ borrowAPY }, mobileViewOptions) => (
                <PercentageCell value={borrowAPY} mobileViewOptions={mobileViewOptions} />
              ),
            },
            actions: {
              header: '',
              renderCell: ({ token, debt, reserveStatus }) => {
                return (
                  <ActionsCell>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        openDialog(borrowDialogConfig, { token })
                      }}
                      disabled={reserveStatus === 'frozen' || !interactive}
                    >
                      Borrow
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      size="sm"
                      disabled={debt.isZero() || !interactive}
                      onClick={() => {
                        openDialog(repayDialogConfig, { token })
                      }}
                    >
                      Repay
                    </Button>
                  </ActionsCell>
                )
              },
            },
          }}
          data={assets}
        />
      </Panel.Content>
    </Panel>
  )
}
