const authorize = jest.fn(() =>
  Promise.resolve({ authToken: "fake-auth-token", expiresIn: 1000000 })
);
const pause = jest.fn(() => Promise.resolve());
const queueAndPlay = jest.fn(() => Promise.resolve());
const search = jest.fn(() =>
  Promise.resolve([
    {
      album: "fake-album",
      artist: "fake-song-artist",
      name: "fake-song-name",
      isrc: "fake-isrc",
      url: "fake-url",
      imgUrl: "fake-img-url",
    },
  ])
);
const songEnded = jest.fn(() => null);

const mock = jest.fn().mockImplementation(() => {
  return { authorize, pause, queueAndPlay, search, songEnded };
});

export default mock;
