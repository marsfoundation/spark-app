import { DependencyList, useRef } from 'react'

// unlike useEffect, this hook is guaranteed to run the callback even if the deps change fast (think a render that triggers another render by changing the state for example)
// also won't run on the first render
export function useOnDepsChange(callback: () => void, deps: DependencyList): void {
  const depsRef = useRef(deps)

  if (deps.some((dep, i) => dep !== depsRef.current[i])) {
    depsRef.current = [...deps]
    setTimeout(() => callback(), 0)
  }
}
