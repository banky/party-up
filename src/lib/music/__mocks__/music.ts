import playlistsFixture from "fixtures/playlists.json";
import songsFixture from "fixtures/songs.json";

let _isAuthorized = true;

const authorize = jest.fn(() =>
  Promise.resolve({ authToken: "fake-auth-token", expiresIn: 1000000 })
);
const configure = jest.fn(() => Promise.resolve());
const unauthorize = jest.fn();
const isAuthorized = jest.fn(() => _isAuthorized);
const play = jest.fn(() => Promise.resolve());
const pause = jest.fn(() => Promise.resolve());
const queueAndPlay = jest.fn(() => Promise.resolve());
const search = jest.fn(() => Promise.resolve(songsFixture));
const songEnded = jest.fn();
const progress = jest.fn((callback) => {
  let currProgress = 0;
  const interval = setInterval(() => {
    currProgress += 1;
    callback(currProgress);
  }, 1);
  return () => clearInterval(interval);
});
const progressMilliseconds = jest.fn(() => Promise.resolve(1000));
const seek = jest.fn(() => Promise.resolve());
const setVolume = jest.fn(() => Promise.resolve());
const getPlaylists = jest.fn(() => Promise.resolve(playlistsFixture));
const getSongsForPlaylist = jest.fn(() => Promise.resolve(songsFixture));

const _setIsAuthorized = (val: boolean) => (_isAuthorized = val);

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
    getPlaylists,
    getSongsForPlaylist,
    _setIsAuthorized,
  };
});

export default mock;
