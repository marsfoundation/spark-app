import { Link } from '../link/Link'

export function TopBanner() {
  return (
    <div className="w-full bg-spark/40 p-0.5 text-center text-basics-black/70 text-sm sm:p-0 sm:text-base">
      MakerDAO is now <strong>Sky</strong>.{' '}
      <Link to="https://forum.makerdao.com/t/sky-has-arrived/24959" external className="underline">
        Read the announcement
      </Link>
    </div>
  )
}
