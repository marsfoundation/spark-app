import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'
import { useMemo } from 'react'

import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { ScrollArea } from '@/ui/atoms/scroll-area/ScrollArea'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/ui/atoms/table/Table'
import { cn } from '@/ui/utils/style'

import { ColumnHeader } from './components/ColumnHeader'
import { ColumnDefinition } from './types'

export type RowClickOptions = { destination: string; external?: boolean }
type RowType = { [k: string]: any; rowClickOptions?: RowClickOptions }

export interface DataTableProps<T extends RowType> {
  columnDef: {
    [key: string]: ColumnDefinition<T>
  }
  scroll?: {
    height: number
  }
  hideTableHeader?: boolean
  gridTemplateColumnsClassName?: string
  data: T[]
  footer?: React.ReactNode
}

/**
 * @note: Using columnDef as a dependency for columns memoizer will cause the table to re-mount on every re-render.
 * If this is the problem, take care of memoizing columnDef outside of the component, so react knows that
 * passed object is the same between renders, which will prevent unnecessary re-mount.
 */
export function DataTable<T extends RowType>({
  columnDef,
  data,
  scroll,
  hideTableHeader = false,
  gridTemplateColumnsClassName,
  footer,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns: ColumnDef<T>[] = useMemo(() => {
    return Object.keys(columnDef).map<ColumnDef<T>>((key) => {
      const definition = columnDef[key]
      return {
        accessorKey: key,
        sortingFn: definition?.sortingFn,
        header: ({ column }) => <ColumnHeader column={column} columnDefinition={definition} />,
        cell: ({ row }) => definition?.renderCell(row.original),
      }
    })
  }, [columnDef])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const Wrapper = scroll ? ScrollWrapperWithHeight({ height: scroll.height }) : React.Fragment

  return (
    <div className="w-full">
      <Wrapper>
        <Table>
          {!hideTableHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className={cn('grid w-full gap-2', gridTemplateColumnsClassName)}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRowWithLink key={row.id} rowClickOptions={row.original.rowClickOptions}>
                <TableRow className={cn('grid w-full items-center gap-2', gridTemplateColumnsClassName)}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              </TableRowWithLink>
            ))}
          </TableBody>
          {footer && <TableFooter>{footer}</TableFooter>}
        </Table>
      </Wrapper>
    </div>
  )
}

interface TableRowWithLinkProps {
  children: React.ReactNode
  rowClickOptions?: RowClickOptions
}

function TableRowWithLink({ children, rowClickOptions }: TableRowWithLinkProps) {
  if (!rowClickOptions) {
    return <>{children}</>
  }
  const { destination, external } = rowClickOptions
  return (
    <LinkDecorator to={destination} external={external}>
      {children}
    </LinkDecorator>
  )
}

function ScrollWrapperWithHeight({ height }: { height: number }) {
  function ScrollWrapper({ children }: { children: React.ReactNode }) {
    return <ScrollArea style={{ height }}>{children}</ScrollArea>
  }

  return ScrollWrapper
}
