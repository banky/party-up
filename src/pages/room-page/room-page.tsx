import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";
import { Search } from "./components/search.component";
import "./room-page.css";
import { Queue } from "./components/queue.component";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const music = useMusic();

  const [roomName, setRoomName] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}`)
      .once("value")
      .then((snapshot) => {
        setRoomName(snapshot.val().name);
      });
  }, [firebase, roomKey]);

  const queueSong = (song: Song) =>
    firebase.database().ref("/rooms").child(roomKey).child("queue").push(song)
      .key;

  const setSongStartTime = () => {
    const time = Date.now();
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

      <Queue roomKey={roomKey} />

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
