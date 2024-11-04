import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex w-full max-w-7xl flex-1 flex-col gap-6 px-3 pt-6 pb-16 lg:mx-auto md:mx-auto md:gap-8 md:pt-10">
      {children}
    </div>
  )
}
