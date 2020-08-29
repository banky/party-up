const authorize = jest.fn(() =>
  Promise.resolve({ authToken: "fake-auth-token", expiresIn: 1000000 })
);
const configure = jest.fn(() => Promise.resolve());
const unauthorize = jest.fn();
const isAuthorized = jest.fn(() => true);
const play = jest.fn(() => Promise.resolve());
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
      smallImage: "fake-img-url",
      mediumImage: "fake-img-url",
    },
  ])
);
const songEnded = jest.fn();
const progress = jest.fn((callback) => {
  callback(10);
  return () => {};
});
const progressMilliseconds = jest.fn(() => Promise.resolve(1000));
const seek = jest.fn(() => Promise.resolve());
const setVolume = jest.fn(() => Promise.resolve());

const mock = jest.fn().mockImplementation(() => {
  return {
    configure,
    authorize,
    unauthorize,
    isAuthorized,
    play,
    pause,
    queueAndPlay,
    search,
    songEnded,
    progress,
    progressMilliseconds,
    seek,
    setVolume,
  };
});

export default mock;
