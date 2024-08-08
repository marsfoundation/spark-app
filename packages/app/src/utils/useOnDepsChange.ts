import { DependencyList, useRef } from "react";

// unlike useEffect, this hook is guaranteed to run the callback even if the deps change fast
// also won't run on the first render
export function useOnDepsChange(callback: () => void, deps: DependencyList): void {
  const depsRef = useRef(deps)

  if (deps.some((dep, i) => dep !== depsRef.current[i])) {
    depsRef.current = [...deps]
    // schedule to avoid failing effect from breaking the render cycle
    setTimeout(() => callback(), 0)
  }
}