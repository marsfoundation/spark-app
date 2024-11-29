import { ReactNode } from 'react'

interface CategoriesGridProps {
  children: ReactNode
}

export function CategoriesGrid({ children }: CategoriesGridProps) {
  return <div className="my-2 grid grid-cols-3 gap-3">{children}</div>
}
