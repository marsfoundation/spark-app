# App

[![CI](https://github.com/marsfoundation/app-public/actions/workflows/ci.yml/badge.svg)](https://github.com/marsfoundation/app-public/actions/workflows/ci.yml)
| [Production](https://app.spark.fi/)

## Development

```sh
pnpm install
pnpm run dev # runs application in dev mode
pnpm run storybook # runs storybook in dev mode
```

## Directory structure

- `ui` folder should only contain reusable chunks of code responsible only for rendering, any data should be passed via
  props. `atoms` consist from `radix-ui` primitives and html tags, `molecules` consist of `atoms`, `organisms` consist
  of `molecules`. `layouts` defines general page layouts and screens.
  [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/).

- `domain` folder contains domain logic. Functions, hooks, types etc. It should contain all the business logic and data
  fetching logic. If some chunks of code are reusable, consider putting it in the `common` subfolder.

- `features` folder is the place where the code specific for a given feature (like easy borrow flow) should be placed.
  It contains logic as well as pure feature specific visual components. It should export a single container (connected
  component) that should wire logic with components. If the chunk of code is reusable (or is generic enough to be
  reusable in the future), put it either in `ui` or `domain` following all the rules.

- `config` folder contains only static (defined during compile time) objects that define the behaviour of the app.

- `utils` folder contains reusable functions, hooks that are **not** domain specific. For domain specific stuff consider
  `domain/common`. For strictly UI specific utils consider `ui/utils`.

## Feature flags

Feature flags need to be verified by using `import.meta.env.VITE_FEATURE_X` (and not some helper functions). Only then
dead code elimination for production builds work and disabled features will be entirely deleted in production build.

Control feature flags via `.env` files:

```
VITE_FEATURE_X=1
```

All feature flags are listed in `.env.example` file.

### Integration tests

Integration tests focus on testing integration between different components within the app and don't hit real (or
forked) blockchain node. We mock networking on viem's transport layer.

```sh
pnpm test
pnpm run test --coverage # to get coverage report
```

### E2E tests

E2E tests utilize Tenderly forks (because local nodes like anvil are too slow) to test real interactions with
blockchain.

```sh
pnpm test-e2e
CI=true pnpm test-e2e # to check locally if E2E tests pass, it's fully parallel, will record trace and retry failed tests (we do the same on CI)
pnpm test-e2e:ui # to inspect in Playwright UI and debug in ephemeral chrome window
```

To control, from E2E test, the way application loads web3 wallets we inject wallet info via global object. To enable
this mechanism you need to start the app with: `pnpm run dev --mode playwright`.

Forks are by default removed after tests, to persist it set `TENDERLY_PERSIST_FORK` env variable to `1`.

To enable tracing for better CI debugging, set `PLAYWRIGHT_TRACE` env variable to `1`. You will able to download
playwright report with traces. The easiest way to explore it is to unpack the contents of `playwright-report` artifact
into the local folder `packages/app/playwright-report`, go to the folder `packages/app` and run

```sh
pnpx playwright show-report
```

#### Deterministic Time in E2E Tests

To ensure deterministic outcomes in e2e tests, we utilize a hardcoded future `simulationDate`, in both the browser
environment and on the forked blockchain. This approach is vital for accurately testing time-sensitive features, such as
LTV checks or fluctuating aToken values. We've chosen an arbitrary future date due to the current lack of more dynamic
time control methods on tenderly forks with idea that in near future we'll refactor to more robust solution.

### Visual regression

Storybook and e2e tests are visually tested. Every story is automatically tested. In E2E tests screenshots are made
explicitly.

### i18n

Read the [Lingui guide](https://lingui.dev/tutorials/setup-react) to understand how we translate the app.

Note: right now we extract the strings right before building the app to ensure that production build works fine. Read
[this](https://github.com/lingui/js-lingui/issues/1803) issue to learn more.

---

_The IP in this repository was assigned to Mars SPC Limited in respect of the MarsOne SP_
