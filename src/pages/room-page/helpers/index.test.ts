import { getRoomName } from "./index";

describe("getRoomName", () => {
  test("adds apostrophe after s", () => {
    const roomName = getRoomName("James");
    expect(roomName).toBe("James' Room");
  });

  test("adds apostrophe s when name doesn't end with s", () => {
    const roomName = getRoomName("Banky");
    expect(roomName).toBe("Banky's Room");
  });
});
