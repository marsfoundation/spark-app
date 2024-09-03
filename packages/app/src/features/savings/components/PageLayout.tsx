import { Percentage } from '@/domain/types/NumericValues'
import { ReactNode } from 'react'
import { WelcomeDialog } from './welcome-dialog/WelcomeDialog'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex w-full max-w-5xl flex-1 flex-col gap-6 px-3 pt-6 pb-16 lg:mx-auto md:mx-auto md:gap-8 md:pt-10">
      {children}
      <WelcomeDialog open={true} setOpen={() => {}} onConfirm={() => {}} apyDifference={Percentage(0.05)} />
    </div>
  )
}
