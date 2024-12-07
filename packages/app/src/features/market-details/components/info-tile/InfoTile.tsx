import { ReactNode } from 'react'

import { cn } from '@/ui/utils/style'

interface InfoTileProps {
  children: ReactNode
  'data-testid'?: string
  className?: string
}
export function InfoTile({ children, 'data-testid': dataTestId, className }: InfoTileProps) {
  return (
    <div
      className={cn('grid grid-cols-2 content-start justify-between gap-1.5 sm:grid-cols-1 sm:gap-0.5', className)}
      data-testid={dataTestId}
    >
      {children}
    </div>
  )
}

function Label({ children }: InfoTileProps) {
  return <div className="typography-label-5 my-auto text-secondary">{children}</div>
}

function Value({ children, 'data-testid': dataTestId, className }: InfoTileProps) {
  return (
    <div
      className={cn(
        'typography-body-4 flex items-center gap-1 justify-self-end text-primary sm:min-h-[26px] sm:justify-self-start',
        className,
      )}
      data-testid={dataTestId}
    >
      {children}
    </div>
  )
}

function ComplementaryLine({ children, 'data-testid': dataTestId, className }: InfoTileProps) {
  return (
    <p
      className={cn(
        'col-start-2 row-start-2 justify-self-end',
        'typography-label-6 text-secondary',
        'sm:col-start-1 sm:row-start-3',
        'sm:justify-self-start',
        className,
      )}
      data-testid={dataTestId}
    >
      {children}
    </p>
  )
}

InfoTile.Label = Label
InfoTile.Value = Value
InfoTile.ComplementaryLine = ComplementaryLine
