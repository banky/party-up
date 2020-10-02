import Firebase from "lib/firebase";
import { createRoomFB } from "./create-room-page.helpers";

describe("createRoomFB", () => {
  const firebase = new Firebase();
  const userId = "fake-user-id";
  const title = "fake-title";
  const genre = "fake-genre";

  it("creates room in firebase as expected", async () => {
    const roomKey = createRoomFB({ firebase, userId, title, genre }) || "";

    const snapshot = await firebase.database().ref("rooms").once("value");

    expect(snapshot.val()[roomKey]).toStrictEqual({
      backgroundColor: { blue: 255, green: 255, red: 255 },
      currentDj: "fake-user-id",
      djs: { "fake-user-id": true },
      genre: "fake-genre",
      owner: "fake-user-id",
      title: "fake-title",
    });
  });
});
