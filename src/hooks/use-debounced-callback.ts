import { useRef, useCallback } from "react";

/**
 * Call a function after it hasn't been called for the wait period
 * @param func A function to be called
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export const useDebouncedCallback = (func: VoidFunction, wait: number) => {
  const timeout = useRef<number>();

  return useCallback(() => {
    const later = () => {
      clearTimeout(timeout.current);
      func();
    };

    clearTimeout(timeout.current);
    timeout.current = setTimeout(later, wait);

    return () => clearTimeout(timeout.current);
  }, [func, wait]);
};
