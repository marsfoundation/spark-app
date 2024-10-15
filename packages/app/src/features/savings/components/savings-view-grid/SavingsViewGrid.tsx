import { PropsWithChildren } from 'react'

export function SavingsViewGrid({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-6 sm:grid sm:min-h-[384px] sm:grid-cols-2">{children}</div>
}
