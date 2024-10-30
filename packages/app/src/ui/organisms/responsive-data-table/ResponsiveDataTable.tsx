import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/ui/atoms/table/Table'
import { ColumnDefinition } from '@/ui/molecules/data-table/types'
import { testIds } from '@/ui/utils/testIds'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'
import { Fragment } from 'react'
import { DataTable } from '../../molecules/data-table/DataTable'
import { CollapsibleCell } from './components/CollapsibleCell'

export interface ResponsiveDataTableProps<T> {
  columnDefinition: { [key: string]: ColumnDefinition<T> }
  scroll?: {
    height: number
  }
  hideTableHeader?: boolean
  gridTemplateColumnsClassName?: string
  data: T[]
  'data-testid'?: string
}

export function ResponsiveDataTable<T extends { [k: string]: any }>({
  columnDefinition,
  data,
  scroll,
  gridTemplateColumnsClassName,
  hideTableHeader = false,
  'data-testid': dataTestId,
}: ResponsiveDataTableProps<T>) {
  const desktop = useBreakpoint('md')

  if (desktop) {
    return (
      <DataTable
        columnDef={columnDefinition}
        data={data}
        scroll={scroll}
        gridTemplateColumnsClassName={gridTemplateColumnsClassName}
        hideTableHeader={hideTableHeader}
        data-testid={dataTestId}
      />
    )
  }

  const [rowHeaderDefinition, ...contentDefinitions] = Object.values(columnDefinition)

  return (
    <Table data-testid={dataTestId}>
      {!hideTableHeader && (
        <TableHeader className="static">
          <TableRow className="flex justify-between">
            {[rowHeaderDefinition?.header, 'More info'].map((header, index) => (
              <TableHead className="p-0 font-bold text-primary text-xs" key={index}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data.map((value, index) => (
          <TableRow key={index} data-testid={testIds.component.DataTable.row(index)}>
            <CollapsibleCell>
              {rowHeaderDefinition?.renderCell(value)}
              {contentDefinitions.map((def, index) => (
                <Fragment key={index}>{def.renderCell(value, { isMobileView: true, rowTitle: def.header })}</Fragment>
              ))}
            </CollapsibleCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
