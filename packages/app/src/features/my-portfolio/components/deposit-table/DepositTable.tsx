import { sortByAPY, sortByUsdValue } from '@/domain/common/sorters'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { CollateralDialog } from '@/features/dialogs/collateral/CollateralDialog'
import { DepositDialog } from '@/features/dialogs/deposit/DepositDialog'
import { WithdrawDialog } from '@/features/dialogs/withdraw/WithdrawDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { ActionsCell } from '@/ui/molecules/data-table/components/ActionsCell'
import { CompactValueCell } from '@/ui/molecules/data-table/components/CompactValueCell'
import { PercentageCell } from '@/ui/molecules/data-table/components/PercentageCell'
import { SwitchCell } from '@/ui/molecules/data-table/components/SwitchCell'
import { TokenWithLogo } from '@/ui/molecules/data-table/components/TokenWithLogo'
import { ResponsiveDataTable } from '@/ui/organisms/responsive-data-table/ResponsiveDataTable'

import { Deposit } from '../../logic/assets'

export interface DepositTableProps {
  assets: Deposit[]
  openDialog: OpenDialogFunction
}

export function DepositTable({ assets, openDialog }: DepositTableProps) {
  return (
    <Panel collapsibleOptions={{ collapsible: true, collapsibleAbove: 'md' }}>
      <Panel.Header>
        <Panel.Title>Deposit</Panel.Title>
      </Panel.Header>

      <Panel.Content>
        <ResponsiveDataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(4,_3fr)_2fr_4fr]"
          columnDefinition={{
            symbol: {
              header: 'Assets',
              renderCell: ({ token, reserveStatus }) => <TokenWithLogo token={token} reserveStatus={reserveStatus} />,
            },
            inWallet: {
              header: 'In Wallet',
              sortable: true,
              sortingFn: (a, b) => sortByUsdValue(a.original, b.original, 'balance'),
              headerAlign: 'right',
              renderCell: ({ token, balance }, mobileViewOptions) => (
                <CompactValueCell token={token} value={balance} mobileViewOptions={mobileViewOptions} hideEmpty />
              ),
            },
            deposit: {
              header: 'Deposit',
              sortable: true,
              sortingFn: (a, b) => sortByUsdValue(a.original, b.original, 'deposit'),
              headerAlign: 'right',
              renderCell: ({ token, deposit }, mobileViewOptions) => (
                <CompactValueCell token={token} value={deposit} mobileViewOptions={mobileViewOptions} hideEmpty />
              ),
            },
            apy: {
              header: <ApyTooltip variant="supply">APY</ApyTooltip>,
              headerAlign: 'right',
              sortable: true,
              sortingFn: (a, b) => sortByAPY(a.original.supplyAPY, b.original.supplyAPY),
              renderCell: ({ supplyAPY }, mobileViewOptions) => (
                <PercentageCell value={supplyAPY} mobileViewOptions={mobileViewOptions} />
              ),
            },
            collateral: {
              header: 'Collateral',
              headerAlign: 'right',
              renderCell: ({ isUsedAsCollateral, token }, mobileViewOptions) => (
                <SwitchCell
                  checked={isUsedAsCollateral}
                  onSwitchClick={(e) => {
                    e.preventDefault()
                    openDialog(CollateralDialog, {
                      useAsCollateral: !isUsedAsCollateral,
                      token,
                    })
                  }}
                  mobileViewOptions={mobileViewOptions}
                />
              ),
            },
            actions: {
              header: '',
              renderCell: ({ token, deposit, reserveStatus }) => {
                return (
                  <ActionsCell>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        openDialog(DepositDialog, { token })
                      }}
                      disabled={reserveStatus === 'frozen'}
                    >
                      Deposit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      disabled={deposit.isZero()}
                      onClick={() => {
                        openDialog(WithdrawDialog, { token })
                      }}
                    >
                      Withdraw
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
