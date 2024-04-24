import { Typography } from '@/ui/atoms/typography/Typography'

export interface DialogSectionTitleProps {
  children: string
}

export function DialogPanelTitle({ children }: DialogSectionTitleProps) {
  return (
    <div className="mb-1">
      <Typography variant="prompt" element="h3" className="text-primary font-semibold">
        {children}
      </Typography>
    </div>
  )
}
