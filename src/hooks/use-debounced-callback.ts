import { useRef, useCallback } from "react";

/**
 * Call a function after it hasn't been called for the wait period
 * @param func A function to be called
 * @param dependencies Similar to `useCallback`, the dependencies of the function
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export const useDebouncedCallback = (
  func: VoidFunction,
  dependencies: any[],
  wait: number
) => {
  const timeout = useRef<number>();
  const memoizedFunc = useCallback(func, [...dependencies]);

  return useCallback(() => {
    const later = () => {
      clearTimeout(timeout.current);
      memoizedFunc();
    };

    clearTimeout(timeout.current);
    timeout.current = setTimeout(later, wait);
  }, [memoizedFunc, wait]);
};
