// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-router-dom", () => ({
  // @ts-ignore: Type is unknown
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    roomKey: "fake-room-key",
  }),
}));

process.env = Object.assign(process.env, {
  REACT_APP_SPOTIFY_CLIENT_ID: "fake-spotify-client-id",
  REACT_APP_BASE_URL: "http://fake-base-url",
  REACT_APP_FIREBASE_DATABASE_URL: "http://localhost:9000?ns=gopartyup",
});
