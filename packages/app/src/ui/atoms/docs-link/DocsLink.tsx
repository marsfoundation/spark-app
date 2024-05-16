import { Link, LinkProps } from '@/ui/atoms/link/Link'

export function DocsLink({ to, children, ...rest }: LinkProps) {
  return (
    <Link to={to} external className="text-slate-500 underline hover:text-slate-700" {...rest}>
      {children}
    </Link>
  )
}
