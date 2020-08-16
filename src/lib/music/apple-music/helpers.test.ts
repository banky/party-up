import { supportedAppleMusicSearchTypes, transformSongs } from "./helpers";
import { SearchType } from "../types";

test("supportedAppleMusicSearchTypes", () => {
  const input: SearchType[] = ["artist", "track", "playlist", "album"];

  const output = supportedAppleMusicSearchTypes(input);
  expect(output).toStrictEqual(["artists", "songs", "playlists", "albums"]);
});

test("transformSongs", () => {
  const input = [
    {
      attributes: {
        albumName: "High School Musical",
        artistName: "Disney",
        name: "Bet on it",
        isrc: "123123123",
        url: "https://music.apple.com/goodsong",
        artwork: {
          url: "http://image.com/{w}x{h}.jpg",
        },
      },
    },
  ];

  const output = transformSongs(input);
  expect(output).toStrictEqual([
    {
      album: "High School Musical",
      artist: "Disney",
      name: "Bet on it",
      isrc: "123123123",
      url: "https://music.apple.com/goodsong",
      smallImage: "http://image.com/64x64.jpg",
      mediumImage: "http://image.com/300x300.jpg",
    },
  ]);
});
