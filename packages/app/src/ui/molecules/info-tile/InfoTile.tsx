import { ReactNode } from 'react'

import { cn } from '@/ui/utils/style'

interface InfoTileProps {
  children: ReactNode
  'data-testid'?: string
}
export function InfoTile({ children, 'data-testid': dataTestId }: InfoTileProps) {
  return (
    <div
      className="grid grid-cols-2 content-start justify-between gap-1.5 sm:grid-cols-1 sm:gap-0.5"
      data-testid={dataTestId}
    >
      {children}
    </div>
  )
}

function Label({ children }: InfoTileProps) {
  return <div className="my-auto text-slate-500 text-sm leading-none sm:text-xs sm:leading-none">{children}</div>
}

function Value({ children, 'data-testid': dataTestId }: InfoTileProps) {
  return (
    <div
      className="flex items-center gap-1 justify-self-end text-sky-950 text-sm leading-none sm:min-h-[26px] sm:justify-self-start sm:text-base sm:leading-none"
      data-testid={dataTestId}
    >
      {children}
    </div>
  )
}

function ComplementaryLine({ children, 'data-testid': dataTestId }: InfoTileProps) {
  return (
    <p
      className={cn(
        'col-start-2 row-start-2 justify-self-end',
        'text-slate-500 text-xs leading-none',
        'sm:col-start-1 sm:row-start-3',
        'sm:justify-self-start sm:leading-none',
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
