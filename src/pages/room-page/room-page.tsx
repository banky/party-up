import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";
import { SongCard } from "../../components/SongCard/SongCard";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const music = useMusic();

  const [roomName, setRoomName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [playQueue, setPlayQueue] = useState<Song[]>([]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/queue`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) {
          setPlayQueue([]);
          return;
        }

        const snapshotValueArray = Object.keys(snapshot.val()).map(
          (key) => snapshot.val()[key]
        );
        setPlayQueue(snapshotValueArray);
      });

    firebase
      .database()
      .ref(`rooms/${roomKey}`)
      .once("value")
      .then((snapshot) => {
        // TODO: Check for null val() here and return a 404 page if null
        setRoomName(snapshot.val().name);
      });
  }, [firebase, roomKey]);

  const queueSong = (song: Song) =>
    firebase.database().ref("/rooms").child(roomKey).child("queue").push(song)
      .key;

  const setSongStartTime = () => {
    const time = Date.now();
    // TODO: This ignores in flight time. Sorry people with shitty internet
    firebase.database().ref(`rooms/${roomKey}/songStartTime`).set(time);
  };

  firebase
    .database()
    .ref("/rooms/" + roomKey)
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
                music
                  .play(
                    "https://music.apple.com/us/album/say-so-feat-nicki-minaj/1510821672?i=1510821685"
                  )
                  .then(() => setSongStartTime())
            : () =>
                music
                  .play("spotify:track:7xGfFoTpQ2E7fRF5lN10tr")
                  .then(() => setSongStartTime())
        }
      >
        Play
      </button>

      <ul className="song-card">
        {searchResults.map((result) => {
          return (
            <SongCard
              songName={result.name}
              artists={result.artist}
              imgUrl={result.imgUrl}
              onClick={() => queueSong(result)}
            />
          );
        })}
      </ul>
    </div>
  );
};
