import { Column } from '@tanstack/react-table'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'

import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'

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
      <Button
        variant="text"
        className={cn(
          'text-primary h-4 cursor-auto p-0 text-xs font-bold',
          sortable && 'hover:text-secondary-foreground cursor-pointer',
        )}
        onClick={() => sortable && column.toggleSorting(column.getIsSorted() === 'asc')}
        postfixIcon={
          sortable &&
          (column.getIsSorted() !== false ? (
            <>{column.getIsSorted() === 'asc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</>
          ) : (
            <ChevronsUpDown size={16} />
          ))
        }
      >
        {header}
      </Button>
    </div>
  )
}
