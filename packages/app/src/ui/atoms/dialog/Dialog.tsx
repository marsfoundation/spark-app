import { cn } from '@/ui/utils/style'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'
import { RefObject } from 'react'
import { Typography } from '../typography/Typography'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 inset-0',
      'z-50 data-[state=closed]:animate-out data-[state=open]:animate-in',
      'fixed inset-0 grid place-items-center overflow-hidden',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const contentVariants = cva('', {
  variants: {
    contentVerticalPosition: {
      center: '-translate-y-1/2 top-1/2',
      top: 'top-0 translate-y-0',
      bottom: '-translate-y-full top-full',
    },
  },
  defaultVariants: {
    contentVerticalPosition: 'center',
  },
})

const overlayVariants = cva('', {
  variants: {
    overlayVariant: {
      moderate: 'bg-background/60 backdrop-blur-sm',
      light: 'bg-background/30 backdrop-blur-[1.5px]',
    },
  },
  defaultVariants: {
    overlayVariant: 'moderate',
  },
})

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
    portalContainerRef?: RefObject<HTMLElement>
    overlayVariant?: 'moderate' | 'light'
    contentVerticalPosition?: 'center' | 'top' | 'bottom'
  }
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      portalContainerRef,
      overlayVariant,
      contentVerticalPosition,
      ...props
    },
    ref,
  ) => (
    <DialogPortal container={portalContainerRef?.current}>
      <DialogOverlay className={cn(overlayVariants({ overlayVariant }))}>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2',
            'data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 flex min-h-screen w-full min-w-full max-w-xl',
            'translate-x-[-50%] flex-col gap-1 bg-background p-6 shadow-lg outline outline-1 outline-border',
            '-outline-offset-1 duration-200 md:min-h-fit md:min-w-fit data-[state=closed]:animate-out data-[state=open]:animate-in sm:rounded-lg',
            'max-h-screen overflow-auto sm:max-h-[90vh]',
            contentVariants({ contentVerticalPosition }),
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute top-6 right-6 rounded-sm opacity-70 ring-offset-background transition-opacity disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  ),
)
DialogContent.displayName = DialogPrimitive.Content.displayName

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
}
DialogHeader.displayName = 'DialogHeader'

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
}
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Typography>,
  React.ComponentPropsWithoutRef<typeof Typography>
>(({ children, className, ...props }, ref) => (
  <Typography variant="h3" ref={ref} className={cn('text-xl', className)} {...props}>
    {children}
  </Typography>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

type DialogProps = React.ComponentProps<typeof Dialog>

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  type DialogProps,
  DialogTitle,
  DialogTrigger,
}
