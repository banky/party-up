import { renderHook } from "@testing-library/react-hooks";
import { useDebouncedCallback } from "hooks/use-debounced-callback";

describe("useDebouncedCallback", () => {
  let counter = 0;
  const adder = () => (counter += 1);

  const { result } = renderHook(() => useDebouncedCallback(adder, [], 10));

  it("only calls function after specified time", async () => {
    result.current();
    result.current();
    result.current();
    expect(counter).toBe(0);

    await new Promise((res) => setTimeout(res, 10));
    expect(counter).toBe(1);
  });
});
