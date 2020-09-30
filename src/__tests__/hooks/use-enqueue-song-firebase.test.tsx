import { useEnqueueSongFirebase } from "hooks/use-enqueue-song-firebase";
import { updateUserId } from "store/actions";
import {
  renderHook,
  mockStore,
  mockFirebaseInstance,
  act,
  mockHistory,
} from "utils/test-utils";

const mockUserId = "fake-user-id";
const mockRoomKey = "fake-room-key";

jest.mock("react-router-dom", () => ({
  // @ts-ignore: Type is unknown
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    roomKey: mockRoomKey,
  }),
}));

describe("useEnqueueSongFirebase", () => {
  beforeAll(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockStore.dispatch(updateUserId(mockUserId));
  });

  it("pushes a song appropriately to firebase", async () => {
    const { result } = renderHook(() => useEnqueueSongFirebase());

    const song = {
      artist: "Doja Cat",
      name: "Say so",
    };

    let newSongId = "";
    await act(async () => {
      mockHistory.push(`/room/${mockRoomKey}`);
      const newSongLocation = await result.current(song);
      newSongId = newSongLocation.toString().slice(-20);
    });

    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms")
      .once("value");

    expect(snapshot.val()).toStrictEqual({
      "fake-room-key": {
        queues: {
          "fake-user-id": {
            [newSongId]: song,
          },
        },
      },
    });
  });
});
