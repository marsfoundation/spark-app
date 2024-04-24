import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex w-full max-w-5xl flex-1 flex-col gap-6 px-3 pb-16 pt-6 md:mx-auto md:gap-8 md:pt-10 lg:mx-auto">
      {children}
    </div>
  )
}
