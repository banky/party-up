import { useProgress } from "./use-progress";
import { renderHook } from "utils/test-utils";

describe("useProgress", () => {
  it("updates the progress state as expected", async () => {
    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useProgress()
    );

    expect(result.current).toBe(0);
    await waitForNextUpdate();
    expect(result.current).toBe(1);
    await waitForNextUpdate();
    expect(result.current).toBe(2);

    unmount();
  });
});
