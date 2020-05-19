import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FirebaseContext } from "../../lib/firebase";
import { search } from "../../lib/music-interface";
import { RootState } from "../../store/reducers";
import { Song } from "../../lib/constants";

export const RoomPage = () => {
  const firebase = useContext(FirebaseContext);
  const { roomId } = useParams();
  const platform = useSelector((state: RootState) => state.platform);

  const [roomName, setRoomName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  firebase?.database
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
          search(platform, searchInput, ["track"]).then((searchResults) =>
            setSearchResults(searchResults)
          )
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
