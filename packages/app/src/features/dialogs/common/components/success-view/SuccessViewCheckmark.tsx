import { IconBox } from '@/ui/atoms/new/icon-box/IconBox'

export function SuccessViewCheckmark() {
  return (
    <div className="flex flex-col items-center gap-5">
      <IconBox variant="success" size="xl" />
      <h2 className="typography-heading-4 text-primary">Congrats, all done!</h2>
    </div>
  )
}
