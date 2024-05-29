import { cva, VariantProps } from 'class-variance-authority'

interface ErrorLayoutProps extends VariantProps<typeof variants> {
  children: React.ReactNode
}

export function ErrorLayout({ children, fullScreen }: ErrorLayoutProps) {
  return <div className={variants({ fullScreen })}>{children}</div>
}

const variants = cva('flex w-full grow flex-col items-center justify-center gap-6', {
  variants: {
    fullScreen: {
      true: 'min-h-screen',
    },
  },
})
