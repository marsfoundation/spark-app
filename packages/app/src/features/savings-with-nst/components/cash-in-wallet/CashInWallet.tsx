import { useMemo } from 'react'

import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { SavingsDepositDialog } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { DataTable, DataTableProps } from '@/ui/molecules/data-table/DataTable'
import { DaiNstUpgradeInfo } from '../../logic/useSavings'
import { MoreDropdown } from './components/MoreDropdown'
import { TokenCell } from './components/TokenCell'

export interface CashInWalletProps {
  assets: TokenWithBalance[]
  openDialog: OpenDialogFunction
  daiNstUpgradeInfo?: DaiNstUpgradeInfo
}

export function CashInWallet({ assets, openDialog, daiNstUpgradeInfo }: CashInWalletProps) {
  // @note: Omitting daiNstUpgradeInfo from deps cause it won't change after component mounts.
  // It prevents unnecessary table re-renders, causing animation glitches and dropdowns not opening.
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const columnDef: DataTableProps<TokenWithBalance>['columnDef'] = useMemo(
    () => ({
      token: {
        header: 'Token',
        renderCell: ({ token }) => <TokenCell token={token} daiNstUpgradeInfo={daiNstUpgradeInfo} />,
      },
      balance: {
        header: 'Balance',
        headerAlign: 'right',
        renderCell: ({ balance, token }) => (
          <div>
            <div className="flex w-full flex-row justify-end">
              {balance.eq(0) ? '-' : token.format(balance, { style: 'auto' })}
            </div>
          </div>
        ),
      },
      actions: {
        header: '',
        renderCell: ({ token, balance }) => {
          return (
            <div className="flex justify-end gap-1 sm:gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={balance.eq(0)}
                onClick={() => openDialog(SavingsDepositDialog, { initialToken: token })}
              >
                Deposit
              </Button>
              <MoreDropdown token={token} daiNstUpgradeInfo={daiNstUpgradeInfo} disabled={balance.eq(0)} />
            </div>
          )
        },
      },
    }),
    [openDialog],
  )

  return (
    <Panel collapsibleOptions={{ collapsible: true }}>
      <Panel.Header>
        <Panel.Title>Cash in wallet</Panel.Title>
      </Panel.Header>
      <Panel.Content>
        <DataTable
          gridTemplateColumnsClassName="grid-cols-[repeat(2,_1fr)_120px] sm:grid-cols-[repeat(2,_1fr)_140px]"
          data={assets}
          columnDef={columnDef}
        />
      </Panel.Content>
    </Panel>
  )
}
