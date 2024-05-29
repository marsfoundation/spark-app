import { useState } from 'react'

import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { Typography } from '@/ui/atoms/typography/Typography'

export function InfoPill({ text, tooltip }: { text: string; tooltip: string }) {
  // https://github.com/radix-ui/primitives/issues/955#issuecomment-1698976935
  const [open, setOpen] = useState(false)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild onClick={() => setOpen(true)}>
        <div className='inline-flex flex-row items-center gap-2 rounded-md bg-background p-2 shadow'>
          <Typography variant="prompt">{text}</Typography>
          <img src={assets.circleInfo} alt="info" />
        </div>
      </TooltipTrigger>
      <TooltipContentShort>{tooltip}</TooltipContentShort>
    </Tooltip>
  )
}
