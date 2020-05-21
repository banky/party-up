import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomId } = useParams();
  const music = useMusic();

  const [roomName, setRoomName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  firebase.database
    .ref("/rooms/" + roomId)
    .once("value")
    .then((snapshot) => {
      setRoomName(snapshot.val().name);
    });

  return (
    <div>
      <h2>{`Welcome to ${roomName}`}</h2>
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
        // onClick={() => music.play("spotify:track:7xGfFoTpQ2E7fRF5lN10tr")}
        onClick={() =>
          music.play(
            "https://music.apple.com/us/album/say-so-feat-nicki-minaj/1510821672?i=1510821685"
          )
        }
      >
        Play
      </button>

      <ul>
        {searchResults.map((result) => {
          return <li>{result.name}</li>;
        })}
      </ul>
    </div>
  );
};
