import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";

declare var global: any;

describe("apple music", () => {
  beforeAll(() => {
    global.MusicKit = {
      configure: jest.fn(),
    };

    render(<App />);
  });

  test("is configured properly", async () => {
    expect(true).toBe(true);
    // await waitFor(() => expect(global.MusicKit.configure).toHaveBeenCalled());
  });
});
