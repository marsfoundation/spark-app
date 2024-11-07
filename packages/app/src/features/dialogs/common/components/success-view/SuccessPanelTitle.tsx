export interface DialogSectionTitleProps {
  children: string
}

export function SuccessViewPanelTitle({ children }: DialogSectionTitleProps) {
  return <div className="typography-label-5 mt-4 mb-1 text-secondary first:mt-0">{children}</div>
}
