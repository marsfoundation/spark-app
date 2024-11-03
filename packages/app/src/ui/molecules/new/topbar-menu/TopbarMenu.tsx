import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { Switch } from '@/ui/atoms/new/switch/Switch'
import { links } from '@/ui/constants/links'
import { getBuildInfo } from '@/ui/utils/getBuildInfo'
import { cn } from '@/ui/utils/style'
import { ExternalLink, Menu, ScrollText, Wand } from 'lucide-react'
import { useState } from 'react'

export interface TopbarMenuProps {
  onSandboxModeClick: () => void
  isSandboxEnabled: boolean
}

export function TopbarMenu({ isSandboxEnabled, onSandboxModeClick }: TopbarMenuProps) {
  const [open, setOpen] = useState(false)

  const { buildSha = 'n/a', buildTime = 'n/a' } = getBuildInfo()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <IconButton icon={Menu} variant="tertiary" className={cn(open && 'text-brand')} size="m" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" variant="secondary" className="flex w-80 flex-col gap-1.5 bg-secondary p-1">
        <DropdownMenuItem
          variant="secondary"
          className="cursor-pointer flex-col items-start py-5"
          onSelect={(event) => {
            onSandboxModeClick()
            // @note prevents dropdown from collapse on switch click
            event.preventDefault()
          }}
        >
          <div className="flex w-full items-center gap-2">
            <DropdownMenuItemIcon icon={Wand} />
            Sandbox Mode
            <Switch checked={isSandboxEnabled} className="ml-auto" />
          </div>
          <div className="typography-label-5 text-secondary">
            Explore Spark with <br />
            unlimited tokens
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem asChild variant="secondary" className="py-6">
          <Link to={links.termsOfUse} external className="cursor-pointer text-primary hover:text-primary">
            <DropdownMenuItemIcon icon={ScrollText} />
            Terms of Service
            <DropdownMenuItemIcon icon={ExternalLink} className="ml-auto" />
          </Link>
        </DropdownMenuItem>

        <div className="typography-label-6 p-5 text-center text-secondary">
          Built from {buildSha} at {buildTime}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

TopbarMenu.displayName = 'TopbarMenu'
