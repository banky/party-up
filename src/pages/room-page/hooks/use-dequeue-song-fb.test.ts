import { mockFirebaseInstance, renderHook } from "utils/test-utils";
import roomFixture from "fixtures/room.json";
import { useDequeueSongFb } from "./use-dequeue-song-fb";

const nextDjId = "7fWUPY3syZZHU4XNxRg9nEWKRhc2";

describe("useDequeueSongFb", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("dequeues the right song from firebase", async () => {
    const { result } = renderHook(() => useDequeueSongFb());
    const currentSong = await result.current();

    expect(currentSong).toStrictEqual({
      album: "The Kids Are Coming - EP",
      artist: "Tones And I",
      name: "Dance Monkey",
      isrc: "QZES71982312",
      url:
        "https://music.apple.com/ca/album/dance-monkey/1475930038?i=1475930045",
      smallImage:
        "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/40/e2/d1/40e2d103-dcd1-e406-cfe9-90eb3bb4a26b/075679839237.jpg/100x100bb.jpeg",
      mediumImage:
        "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/40/e2/d1/40e2d103-dcd1-e406-cfe9-90eb3bb4a26b/075679839237.jpg/300x300bb.jpeg",
    });
  });

  it("sets the currentDJ in firebase correctly", async () => {
    const { result } = renderHook(() => useDequeueSongFb());
    await result.current();

    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms/fake-room-key/currentDj")
      .once("value");

    expect(snapshot.val()).toBe(nextDjId);
  });

  it("removes the dequeued song from the users queue", async () => {
    const { result } = renderHook(() => useDequeueSongFb());
    await result.current();

    const snapshot = await mockFirebaseInstance
      .database()
      .ref(`rooms/fake-room-key/queues/${nextDjId}`)
      .once("value");

    expect(snapshot.val()).toStrictEqual({
      "-MIGYiFsLso4nzV4KfN7": {
        album: "Fire on Marzz - EP",
        artist: "BENEE",
        isrc: "USUM71911687",
        mediumImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music123/v4/7c/ea/13/7cea13d4-e921-a9ee-9688-7b0e4a8a85a6/19UMGIM54697.rgb.jpg/300x300bb.jpeg",
        name: "Glitter",
        smallImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music123/v4/7c/ea/13/7cea13d4-e921-a9ee-9688-7b0e4a8a85a6/19UMGIM54697.rgb.jpg/100x100bb.jpeg",
        url: "https://music.apple.com/ca/album/glitter/1469442495?i=1469442499",
      },
    });
  });
});
