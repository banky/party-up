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

      <ul>
        {searchResults.map((result) => {
          return <li>{result.name}</li>;
        })}
      </ul>
    </div>
  );
};
