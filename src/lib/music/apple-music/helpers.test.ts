import {
  formatImgUrl,
  supportedAppleMusicSearchTypes,
  transformPlaylists,
  transformSongs,
} from "./helpers";
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
      smallImage: "http://image.com/100x100.jpg",
      mediumImage: "http://image.com/300x300.jpg",
    },
  ]);
});

test("formatImgUrl", () => {
  const url =
    "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/5f/5f/54/5f5f5492-bc5a-3a38-3bcf-ec5e59bb6c84/886447991824.jpg/{w}x{h}bb.jpeg";
  expect(formatImgUrl(url, 100)).toBe(
    "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/5f/5f/54/5f5f5492-bc5a-3a38-3bcf-ec5e59bb6c84/886447991824.jpg/100x100bb.jpeg"
  );
});

test("transformPlaylists", () => {
  const input = [
    {
      id: "p.XB3buWGAOR1",
      type: "library-playlists",
      href: "/v1/me/library/playlists/p.XB3buWGAOR1",
      attributes: {
        artwork: {
          width: null,
          height: null,
          url:
            "https://is3-ssl.mzstatic.com/image/thumb/Features114/v4/55/ce/cd/55cecd48-260d-6075-a062-485f29e1c476/source/{w}x{h}SC.DN01.jpeg",
        },
        canEdit: false,
        playParams: {
          id: "p.XB3buWGAOR1",
          kind: "playlist",
          isLibrary: true,
          globalId: "pl.d133de76fb4f4ccf98846231899874c0",
        },
        description: { standard: "A select mix of recent alternative hits." },
        dateAdded: "2019-03-31T16:00:32Z",
        name: "Alternative Replay",
        hasCatalog: true,
      },
    },
    {
      id: "p.WxoLid0Y6ma",
      type: "library-playlists",
      href: "/v1/me/library/playlists/p.WxoLid0Y6ma",
      attributes: {
        artwork: {
          width: null,
          height: null,
          url:
            "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/0b/8d/d3/0b8dd309-2fd8-a91c-d226-3ee66dfcdd0c/source/{w}x{h}SC.FPESS01.jpeg",
        },
        canEdit: false,
        playParams: {
          id: "p.WxoLid0Y6ma",
          kind: "playlist",
          isLibrary: true,
          globalId: "pl.b5deb01c5d1541ba881b9418f79b5ea6",
        },
        description: {
          standard:
            "It took the ultimate anti-pop star to redefine pop for the 2020s.",
        },
        dateAdded: "2019-10-01T18:32:48Z",
        name: "Billie Eilish Essentials",
        hasCatalog: true,
      },
    },
  ];

  const output = transformPlaylists(input);
  expect(output).toStrictEqual([
    {
      id: "/v1/me/library/playlists/p.XB3buWGAOR1",
      name: "Alternative Replay",
      description: "A select mix of recent alternative hits.",
      image:
        "https://is3-ssl.mzstatic.com/image/thumb/Features114/v4/55/ce/cd/55cecd48-260d-6075-a062-485f29e1c476/source/100x100SC.DN01.jpeg",
    },
    {
      id: "/v1/me/library/playlists/p.WxoLid0Y6ma",
      name: "Billie Eilish Essentials",
      description:
        "It took the ultimate anti-pop star to redefine pop for the 2020s.",
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/0b/8d/d3/0b8dd309-2fd8-a91c-d226-3ee66dfcdd0c/source/100x100SC.FPESS01.jpeg",
    },
  ]);
});
