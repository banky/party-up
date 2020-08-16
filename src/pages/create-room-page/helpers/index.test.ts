import { roomNameFromOwner } from "./index";

describe("getRoomName", () => {
  test("adds apostrophe after s", () => {
    const roomName = roomNameFromOwner("James");
    expect(roomName).toBe("James' Room");
  });

  test("adds apostrophe s when name doesn't end with s", () => {
    const roomName = roomNameFromOwner("Banky");
    expect(roomName).toBe("Banky's Room");
  });
});
