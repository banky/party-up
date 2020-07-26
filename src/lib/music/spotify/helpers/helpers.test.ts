import {
  loadScript,
  initializePlayer,
  getPlayerOptions,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  loadSpotifyWebPlayer,
  transformSongs,
} from ".";

const globalAny: any = global;

describe("loadScript", () => {
  afterAll(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("should append to DOM", () => {
    // Set up our document body
    document.body.innerHTML =
      "<div>" +
      '  <span id="username" />' +
      '  <button id="button" />' +
      "</div>";

    loadScript({ id: "test-id", defer: false, source: "fake-url.com" });
    expect(document.head.innerHTML).toBe(
      '<script id="test-id" type="text/javascript" src="fake-url.com"></script>'
    );
  });
});

test("initializePlayer", async () => {
  const connect = jest.fn().mockImplementation(() => Promise.resolve(true));

  globalAny.Spotify = {
    Player: jest.fn().mockImplementation(() => {
      return {
        connect: connect,
      };
    }),
  };

  await initializePlayer("fake-auth-token");
  expect(connect).toHaveBeenCalled();
});

// describe("getPlayerOptions", () => {
//   beforeAll(() => {
//     window.spotifyPlayer = {};
//   });

//   test("with no player defined", () => {
//     expect(getPlayerOptions()).toStrictEqual({
//       playerId: undefined,
//     });
//   });

//   test("with player defined", () => {
//     window.spotifyPlayer = {
//       _options: {
//         id: "fake-player-id",
//       },
//     };

//     expect(getPlayerOptions()).toStrictEqual({
//       playerId: "fake-player-id",
//     });
//   });
// });

test("openSpotifyLoginWindow", () => {
  window.open = jest.fn();

  const expectedUrl =
    "https://accounts.spotify.com/authorize?client_id=fake-spotify-client-id&response_type=code&redirect_uri=http%3A%2F%2Ffake-base-url%2Fspotify-callback&scope=streaming%20user-read-email%20user-read-private%20user-modify-playback-state%20user-read-playback-state&code_challenge_method=S256&code_challenge=J7enCDw-_Z6s8Q-h1y_Egu8La4K3nvo4nbY0czlNVf8";

  openSpotifyLoginWindow("fake-auth-code-verifier");
  expect(window.open).toHaveBeenCalledWith(
    expectedUrl,
    "_blank",
    "location=yes,height=600,width=600,scrollbars=yes,status=yes"
  );
});

test("getAuthTokenFromChildWindow", async () => {
  const childWindow = { closed: false };
  setTimeout(() => {
    childWindow.closed = true;
    window.setSpotifyAuthToken({
      code: "fake-auth-code",
    });
  }, 10);

  // @ts-ignore: Mocking window is hard
  const token = await getAuthTokenFromChildWindow(childWindow);
  expect(token).toStrictEqual({
    code: "fake-auth-code",
  });
});

describe("loadSpotifyWebPlayer", () => {
  afterAll(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("loadSpotifyWebPlayer", async () => {
    jest.mock("./helpers", () => ({
      loadScript: jest.fn().mockImplementation(() => Promise.resolve()),
    }));

    loadSpotifyWebPlayer();

    expect(document.head.innerHTML).toBe(
      '<script id="spotify-player" type="text/javascript" defer="" src="https://sdk.scdn.co/spotify-player.js"></script>'
    );
  });
});

test("transformSongs", () => {
  const input = [
    {
      album: {
        name: "56 Nights",
        images: [
          {
            url: "big-image",
          },
          {
            url: "med-image",
          },
          {
            url: "small-image",
          },
        ],
      },
      artists: [
        {
          name: "Future",
        },
        {
          name: "Fake artist",
        },
      ],
      name: "March madness",
      external_ids: {
        isrc: "123123123",
      },
      uri: "fake-url.com",
    },
  ];

  expect(transformSongs(input)).toStrictEqual([
    {
      album: "56 Nights",
      artist: "Future, Fake artist",
      imgUrl: "small-image",
      isrc: "123123123",
      name: "March madness",
      url: "fake-url.com",
    },
  ]);
});
