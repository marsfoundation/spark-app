import { cn } from '@/ui/utils/style'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VariantProps, cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'
import { RefObject } from 'react'
import { IconButton } from '../new/icon-button/IconButton'

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

const contentVariants = cva(
  cn(
    'fixed top-[50%] left-[50%] z-50 flex max-h-screen min-h-screen w-full max-w-full translate-x-[-50%] md:w-[686px]',
    'grid overflow-hidden overflow-y-auto bg-primary duration-200 md:max-h-[90vh] md:min-h-fit md:rounded-md',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2',
    'data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:animate-out data-[state=open]:animate-in',
  ),
  {
    variants: {
      contentVerticalPosition: {
        center: '-translate-y-1/2 top-1/2',
        top: 'top-0 translate-y-0',
        bottom: '-translate-y-full top-full',
      },
      spacing: {
        none: 'p-0',
        default: 'p-8',
      },
    },
    defaultVariants: {
      spacing: 'default',
      contentVerticalPosition: 'center',
    },
  },
)

const overlayVariants = cva('', {
  variants: {
    overlayVariant: {
      default: 'bg-reskin-alpha-dialog backdrop-blur-sm',
      delicate: 'bg-reskin-neutral-950/25 backdrop-blur-[1.5px]',
    },
  },
  defaultVariants: {
    overlayVariant: 'default',
  },
})

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof contentVariants> &
    VariantProps<typeof overlayVariants> & {
      showCloseButton?: boolean
      portalContainerRef?: RefObject<HTMLElement>
      preventAutoFocus?: boolean
    }
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      portalContainerRef,
      spacing,
      overlayVariant,
      contentVerticalPosition,
      preventAutoFocus = false,
      ...props
    },
    ref,
  ) => (
    <DialogPortal container={portalContainerRef?.current}>
      <DialogOverlay className={overlayVariants({ overlayVariant })}>
        <DialogPrimitive.Content
          // @note: Radix has internal bug that causes issues with autofocus eg. tooltips opened by default
          // https://github.com/radix-ui/primitives/issues/2248
          onOpenAutoFocus={preventAutoFocus ? (event) => event.preventDefault() : undefined}
          ref={ref}
          className={cn(contentVariants({ contentVerticalPosition, spacing }), className)}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close>
              <IconButton variant="transparent" icon={X} size="l" className="absolute top-6 right-6" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  ),
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = React.forwardRef<HTMLHeadingElement, { children: React.ReactNode; className?: string }>(
  ({ children, className }, ref) => (
    <h1 ref={ref} className={cn('typography-heading-5 text-primary', className)}>
      {children}
    </h1>
  ),
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

type DialogProps = React.ComponentProps<typeof Dialog>

// @note: Omitting exporting DialogDescription, DialogFooter, DialogHeader because we don't need them
export { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, type DialogProps, DialogTitle, DialogTrigger }
