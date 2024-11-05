import { Path, pathGroups, paths } from '@/config/paths'
import { cn } from '@/ui/utils/style'
import { CSSProperties } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

const pageGradients = {
  savings: {
    from: '#11B93E',
    via: '#40DA69',
    to: '#FFFFFF',
  },
  farms: {
    from: '#FA43BD',
    via: '#FFB5B5',
    to: '#FFFFFF',
  },
  borrow: {
    from: '#FF895D',
    via: '#FFE6A4',
    to: '#FFFFFF',
  },
}

export function LayoutBackground() {
  const location = useLocation()

  const currentPage = Object.entries(paths).find(([_, path]) => matchPath(path, location.pathname))?.[0] as Path

  const activePathGroup = Object.entries(pathGroups).find(([_, paths]) =>
    paths.includes(currentPage),
  )?.[0] as keyof typeof pathGroups

  return (
    <div
      className={cn(
        'fixed top-0 right-0 z-10 aspect-[582/1010] bg-[url("/backgrounds/background-lines.svg")] bg-contain bg-no-repeat',
        'w-[200vw] max-w-[1010px] lg:w-full md:w-[125vw] sm:w-[150vw]',
      )}
    >
      <div
        className={cn(
          'aspect-square w-[70vw] translate-x-[643px] translate-y-[66px] blur-[250px] md:w-[367px] sm:blur-[384px]',
          'bg-gradient-to-r from-[--gradient-from] via-[--gradient-via] to-[--gradient-to] duration-300 ease-out [transition-property:_--gradient-from,_--gradient-via,_--gradient-to]',
        )}
        style={
          {
            '--gradient-from': pageGradients[activePathGroup].from,
            '--gradient-via': pageGradients[activePathGroup].via,
            '--gradient-to': pageGradients[activePathGroup].to,
          } as CSSProperties
        }
      />
    </div>
  )
}
