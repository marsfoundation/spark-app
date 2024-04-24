export interface NavbarActionWrapperProps {
  label: string
  children: React.ReactNode
}

export function NavbarActionWrapper({ label, children }: NavbarActionWrapperProps) {
  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto">
      <div className="text-basics-dark-grey text-sm lg:hidden">{label}</div>
      {children}
    </div>
  )
}
