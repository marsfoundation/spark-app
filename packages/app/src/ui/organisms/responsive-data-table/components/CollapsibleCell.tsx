import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { TableCell } from '@/ui/atoms/table/Table'
import { Typography } from '@/ui/atoms/typography/Typography'

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
              <button role="switch">
                <Typography variant="prompt">
                  {open ? (
                    <ChevronUp className="ml-1 inline-block -translate-y-[1px]" size={16} />
                  ) : (
                    <ChevronDown className="ml-1 inline-block -translate-y-[1px]" size={16} />
                  )}
                </Typography>
              </button>
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
