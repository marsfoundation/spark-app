import { IconButton } from '@/ui/atoms/icon-button/IconButton'
import { TableCell } from '@/ui/atoms/table/Table'
import { cn } from '@/ui/utils/style'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronDown } from 'lucide-react'
import { ReactNode, useState } from 'react'

interface CollapsibleCellProps {
  children: [ReactNode, ReactNode]
}

export function CollapsibleCell({ children }: CollapsibleCellProps) {
  const [TriggerContent, Content] = children
  const [open, setOpen] = useState(false)

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen} asChild>
      <TableCell>
        <CollapsiblePrimitive.CollapsibleTrigger asChild className="cursor-auto">
          <div className="flex flex-row justify-between">
            {TriggerContent}
            <div className="flex cursor-pointer flex-col justify-center">
              <IconButton
                role="switch"
                size="m"
                variant="transparent"
                icon={ChevronDown}
                className={cn('transition-transform duration-300', open && 'rotate-180')}
              />
            </div>
          </div>
        </CollapsiblePrimitive.CollapsibleTrigger>
        <CollapsiblePrimitive.CollapsibleContent>
          <div className="mt-4 flex flex-col gap-3.5">{Content}</div>
        </CollapsiblePrimitive.CollapsibleContent>
      </TableCell>
    </CollapsiblePrimitive.Root>
  )
}
