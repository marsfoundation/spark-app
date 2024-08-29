import { Link } from '../link/Link'

export function TopBanner() {
  return (
    <div className="w-full bg-[radial-gradient(circle_at_center,_#413A96_0%,_#352D7D_50%,_rgb(199,141,242)_100%)] p-0.5 text-center text-basics-white/85 text-sm sm:p-0 sm:text-base">
      MakerDAO is now <strong className="text-basics-white">Sky</strong>.{' '}
      <Link
        to="https://forum.makerdao.com/t/sky-has-arrived/24959"
        external
        className="text-basics-white/90 underline hover:text-basics-white"
      >
        Read the announcement
      </Link>
    </div>
  )
}
