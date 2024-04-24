import { Link } from '../link/Link'

export function TopBanner() {
  return (
    <div className="bg-spark/40 text-basics-black/70 w-full p-0.5 text-center text-sm sm:p-0 sm:text-base">
      Welcome to the <strong>new Spark App</strong>!{' '}
      <Link to="https://twitter.com/sparkdotfi" external className="underline">
        Read the announcement
      </Link>
      . Old app is available under{' '}
      <Link to="https://legacy-app.spark.fi/" external className="underline">
        legacy-app.spark.fi
      </Link>
    </div>
  )
}
