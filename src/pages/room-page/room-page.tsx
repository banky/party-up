import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";
import { SongCard } from "../../components/SongCard/SongCard";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomId } = useParams();
  const music = useMusic();

  const [roomName, setRoomName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  firebase
    .database()
    .ref("/rooms/" + roomId)
    .once("value")
    .then((snapshot) => {
      setRoomName(snapshot.val().name);
    });

  return (
    <div>
      <h1>{`Welcome to ${roomName}`}</h1>
      <input
        placeholder="Search for a song! "
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button
        onClick={() =>
          music
            .search(searchInput, ["track"])
            .then((searchResults) => setSearchResults(searchResults))
        }
      >
        Search
      </button>

      <button
        // TODO: This is just for now to show that play works
        onClick={
          music.platform === "apple"
            ? () =>
              music.play(
                "https://music.apple.com/us/album/say-so-feat-nicki-minaj/1510821672?i=1510821685"
              )
            : () => music.play("spotify:track:7xGfFoTpQ2E7fRF5lN10tr")
        }
      >
        Play
      </button>

      <ul className="song-card">
        {searchResults.map((result) => {
          console.log("result", result);
          return <SongCard
            songName={result.name}
            artists={result.artist}
            imgUrl={result.imgUrl}
          />
        })}
      </ul>
    </div>
  );
};
