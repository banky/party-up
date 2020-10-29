import { useSetCurrentSongFB } from "./use-set-current-song-fb";
import roomFixture from "fixtures/room.json";
import songFixture from "fixtures/song.json";
import { mockFirebaseInstance, renderHook } from "utils/test-utils";

describe("useSetCurrentSongFB", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("sets the current song as expected", async () => {
    const { result } = renderHook(() => useSetCurrentSongFB());
    await result.current(songFixture);

    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms/fake-room-key/currentSong")
      .once("value");
    expect(snapshot.val()).toStrictEqual({
      album: "Sunflower - Single",
      artist: "Dizzy",
      name: "Sunflower",
      isrc: "GB6TW2000001",
      url: "https://music.apple.com/ca/album/sunflower/1498698255?i=1498698260",
      smallImage:
        "https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/42/c1/6d/42c16d2f-8a82-2a34-eff8-de7157ff9975/20UMGIM05863.rgb.jpg/100x100bb.jpeg",
      mediumImage:
        "https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/42/c1/6d/42c16d2f-8a82-2a34-eff8-de7157ff9975/20UMGIM05863.rgb.jpg/300x300bb.jpeg",
    });
  });

  it("pushes the previous song to history as expected", async () => {
    const { result } = renderHook(() => useSetCurrentSongFB());
    await result.current(songFixture);

    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms/fake-room-key/history")
      .once("value");

    const songHistoryArray = Object.values(snapshot.val());

    expect(songHistoryArray[songHistoryArray.length - 1]).toStrictEqual({
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
    });
  });
});
