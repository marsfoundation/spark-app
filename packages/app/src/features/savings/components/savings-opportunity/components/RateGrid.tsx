import { ReactNode } from 'react'

export function RateGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-rows-[1fr_auto] items-center gap-4">{children}</div>
}
