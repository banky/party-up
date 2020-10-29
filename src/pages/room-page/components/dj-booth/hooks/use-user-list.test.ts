import { mockFirebaseInstance, renderHook } from "utils/test-utils";
import { useUserList } from "./use-user-list";
import userListFixture from "fixtures/user-list.json";
import roomFixture from "fixtures/room.json";

const mockRoomKey = "fake-room-key";

describe("useUserList", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("users").set(userListFixture);
    mockFirebaseInstance
      .database()
      .ref(`rooms/${mockRoomKey}`)
      .set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("gets the expected list of users", async () => {
    const { result, waitFor } = renderHook(() =>
      useUserList(`rooms/${mockRoomKey}/djs`)
    );

    await waitFor(() =>
      expect(result.current).toStrictEqual([
        {
          userId: "7fWUPY3syZZHU4XNxRg9nEWKRhc2",
          imageUrl: "https://image.flaticon.com/icons/png/512/37/37232.png",
          name: "Bobby",
          platform: "apple",
        },
        {
          userId: "VlMsVUpY4fQJh1SCswAQ9M1QgjE3",
          imageUrl: "https://image.flaticon.com/icons/png/512/37/37232.png",
          name: "austin",
          platform: "spotify",
        },
      ])
    );
  });
});
