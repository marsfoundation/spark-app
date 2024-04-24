# Hot patching `node_modules`

Sometimes it's useful to tweak source code of a dependency to debug an issue or fix a bug. With `vite` it won't work
unless its cache is reloaded. You can enforce it with `--force` flag.

```sh
pnpm dev --force
```
