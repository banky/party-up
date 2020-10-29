import { useUpdateUserInFirebase } from "hooks/use-update-user-firebase";
import { Platform } from "lib/music/music";
import { renderHook, mockFirebaseInstance, act } from "utils/test-utils";

const mockUserId = "fake-user-id";
const mockName = "fake-name";
const mockPlatform: Platform = "apple";
const mockImgUrl = "fake-img-url";

describe("useUpdateUserInFirebase", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  const { result } = renderHook(() => useUpdateUserInFirebase());

  describe("when all params are given", () => {
    it("updates the database as expected", async () => {
      act(() => {
        result.current({
          userId: mockUserId,
          name: mockName,
          platform: mockPlatform,
          imageUrl: mockImgUrl,
        });
      });
      const snapshot = await mockFirebaseInstance
        .database()
        .ref()
        .once("value");

      expect(snapshot.val()).toStrictEqual({
        users: {
          "fake-user-id": {
            imageUrl: "fake-img-url",
            name: "fake-name",
            platform: "apple",
          },
        },
      });
    });
  });

  describe("when platform is omitted", () => {
    it("updates the database as expected", async () => {
      act(() => {
        result.current({
          userId: mockUserId,
          name: mockName,
          imageUrl: mockImgUrl,
        });
      });
      const snapshot = await mockFirebaseInstance
        .database()
        .ref()
        .once("value");

      expect(snapshot.val()).toStrictEqual({
        users: {
          "fake-user-id": {
            imageUrl: "fake-img-url",
            name: "fake-name",
          },
        },
      });
    });
  });

  describe("when image url is omitted", () => {
    it("updates the database as expected", async () => {
      act(() => {
        result.current({
          userId: mockUserId,
          name: mockName,
        });
      });
      const snapshot = await mockFirebaseInstance
        .database()
        .ref()
        .once("value");

      expect(snapshot.val()).toStrictEqual({
        users: {
          "fake-user-id": {
            imageUrl: "https://image.flaticon.com/icons/png/512/37/37232.png",
            name: "fake-name",
          },
        },
      });
    });
  });
});
