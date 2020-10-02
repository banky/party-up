import { useUserAuthorized } from "hooks/use-user-authorized";
import { updateDestinationRoomKey } from "store/actions";
import {
  renderHook,
  mockStore,
  act,
  mockMusicInstance,
} from "utils/test-utils";

describe("useUserAuthorized", () => {
  describe("when user is logged in", () => {
    it("updates the destination room key to nothing", () => {
      act(() => {
        mockStore.dispatch(updateDestinationRoomKey("fake-room-to-go-to"));
        renderHook(() => useUserAuthorized());
      });

      expect(mockStore.getState().destinationRoomKey).toBe(undefined);
    });
  });

  describe("when user is not logged in", () => {
    it("updates the destination room key to nothing", () => {
      act(() => {
        // @ts-ignore Needed on mocked setters
        mockMusicInstance._setIsAuthorized(false);
        renderHook(() => useUserAuthorized());
      });

      expect(mockStore.getState().destinationRoomKey).toBe("fake-room-key");
    });
  });
});
