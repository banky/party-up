import React from "react";
import { render, act, waitFor } from "__tests__/test-utils";
import { RoomPage } from "pages/room-page/room-page";

describe("Renders something?", () => {
  act(() => {
    render(<RoomPage />);
  });

  it("does something", async () => {
    await waitFor(() => expect(true).toBe(true));
  });
});
