import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { Column } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDown } from 'lucide-react'
import { ColumnDefinition } from '../types'

interface ColumnHeaderProps<T> {
  column: Column<T>
  columnDefinition: ColumnDefinition<T> | undefined
}

export function ColumnHeader<T>({ column, columnDefinition }: ColumnHeaderProps<T>) {
  const { headerAlign, sortable, header } = columnDefinition ?? {}
  return (
    <div
      className={cn(
        'flex flex-row',
        headerAlign === 'center' && 'justify-center',
        headerAlign === 'right' && 'justify-end',
      )}
    >
      {sortable ? (
        <Button
          variant="transparent"
          className="!typography-label-4 h-4 cursor-pointer rounded-[1px] p-0 text-secondary"
          onClick={() => sortable && column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {column.getIsSorted() !== false ? (
            <>
              {column.getIsSorted() === 'asc' ? (
                <ChevronDownIcon className="icon-xs" />
              ) : (
                <ChevronUpIcon className="icon-xs" />
              )}
            </>
          ) : (
            <ChevronsUpDown size={16} />
          )}
          {header}
        </Button>
      ) : (
        <span className="typography-label-4 h-4 text-secondary ">{header}</span>
      )}
    </div>
  )
}
