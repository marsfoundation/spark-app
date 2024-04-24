# Bundle size optimizing mini guide

0. We track bundle size changes on each PR so changes that make bundle explode should be caught very early.
1. Run `pnpm build` and use `npx vite-bundle-visualizer` to understand what makes bundle size grow.
2. In most cases something is preventing tree shaking from doing its work. This can be a lack of `sideEffects: false` in
   `package.json` or usage of CJS in one of the dependencies. Try updating the dep or patching it with `pnpm patch`.
