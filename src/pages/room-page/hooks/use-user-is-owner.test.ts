import { useUserIsOwner } from "./use-user-is-owner";
import roomFixture from "fixtures/room.json";
import { mockFirebaseInstance, mockStore, renderHook } from "utils/test-utils";
import { act } from "react-test-renderer";
import { updateUserId } from "store/actions";

describe("useUserIsOwner", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("returns true for owner", async () => {
    const { result, waitFor } = renderHook(() => useUserIsOwner());
    act(() => {
      mockStore.dispatch(updateUserId("VlMsVUpY4fQJh1SCswAQ9M1QgjE3"));
    });

    waitFor(() => expect(result.current).toBe(true));
  });

  it("returns false for non owner", async () => {
    const { result, waitFor } = renderHook(() => useUserIsOwner());
    act(() => {
      mockStore.dispatch(updateUserId("2DDMK1E5k9TcnmnxsYc5TK0pmCt1"));
    });

    waitFor(() => expect(result.current).toBe(false));
  });
});
