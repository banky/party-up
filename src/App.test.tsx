import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

declare var global: any;

describe("apple music", () => {
  beforeAll(() => {
    global.MusicKit = {
      configure: jest.fn(),
    };

    render(<App />);
  });

  test("is configured properly", () => {
    expect(global.MusicKit.configure).toHaveBeenCalled();
  });
});
