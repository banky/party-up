import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";
import { SongCard } from "../../components/song-card/song-card";
import { Search } from "./components/search.component";
import "./room-page.css";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const music = useMusic();

  const [roomName, setRoomName] = useState("");
  const [showSearch, setShowSearch] = useState(false);
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

        const snapshotAsArray = Object.keys(snapshot.val()).map(
          (key) => snapshot.val()[key]
        );
        setPlayQueue(snapshotAsArray);
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

  console.log("rendering");

  return (
    <div>
      <h1>{`Welcome to ${roomName}`}</h1>
      <button onClick={() => setShowSearch(true)}>Search</button>
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

      <ul className="song-queue">
        {playQueue.map((result) => {
          return (
            <li className="song-queue-item" key={result.url}>
              <SongCard
                songName={result.name}
                artists={result.artist}
                imgUrl={result.imgUrl}
              />
            </li>
          );
        })}
      </ul>

      {showSearch && (
        <Search
          cancelSearch={() => setShowSearch(false)}
          onSelectSong={(song) => {
            queueSong(song);
            setShowSearch(false);
          }}
        />
      )}
    </div>
  );
};
