import { updateUserId } from "store/actions";
import { mockFirebaseInstance, mockStore, renderHook } from "utils/test-utils";
import roomFixture from "fixtures/room.json";
import { useCurrentSong } from "./use-current-song";

const mockUserId = "fake-user-id";

describe("useCurrentSong", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
    mockStore.dispatch(updateUserId(mockUserId));
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("gets the current song from firebase", async () => {
    const { result, waitFor } = renderHook(() => useCurrentSong());

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        album: "The Best of... So Far (Deluxe)",
        artist: "The Kooks",
        isrc: "GBAAA0500835",
        mediumImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music118/v4/d5/08/e2/d508e22e-1b41-7820-6c60-1197df3c6a48/00602557536300.rgb.jpg/300x300bb.jpeg",
        name: "She Moves In Her Own Way",
        smallImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music118/v4/d5/08/e2/d508e22e-1b41-7820-6c60-1197df3c6a48/00602557536300.rgb.jpg/100x100bb.jpeg",
        url:
          "https://music.apple.com/ca/album/she-moves-in-her-own-way/1442991297?i=1442991307",
      })
    );
  });
});
