import { ArrowLeft } from 'lucide-react'

import { paths } from '@/config/paths'
import { LinkButton } from '@/ui/atoms/button/Button'

export function BackNav() {
  return (
    <div className="flex items-center gap-1 px-3 sm:px-0">
      <LinkButton to={paths.markets} variant="text" size="sm" spaceAround="none" prefixIcon={<ArrowLeft size={16} />}>
        Back to Markets
      </LinkButton>
    </div>
  )
}
