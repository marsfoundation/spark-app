interface ErrorLayoutProps {
  children: React.ReactNode
}

export function ErrorLayout({ children }: ErrorLayoutProps) {
  return <div className="flex w-full grow flex-col items-center justify-center gap-6">{children}</div>
}
