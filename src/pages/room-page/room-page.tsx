import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";
import { Search } from "./components/search.component";
import { Queue } from "./components/queue.component";
import "./room-page.css";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const music = useMusic();
  const history = useHistory();

  const [roomName, setRoomName] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const playFirstSongOnQueue = useCallback(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/queue`)
      .once("value", async (snapshot) => {
        if (!snapshot.exists()) return;

        const songList = snapshot.val();
        const songKeys = Object.keys(songList);
        const currentSong: Song = songList[songKeys[0]];

        // Synchronize the player with the room
        const songStartTimeSnapshot = await firebase
          .database()
          .ref(`rooms/${roomKey}/songStartTime`)
          .once("value");
        const songStartTime = songStartTimeSnapshot.val();
        const songCurrentTime = Date.now() - songStartTime;

        console.log("songCurrentTime: ", songCurrentTime);
        await music.play(currentSong);
        // music.seek(songCurrentTime);
      });
  }, [firebase, music, roomKey]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) return history.push("/not-found");
        setRoomName(snapshot.val().name);
      });
  }, [firebase, history, roomKey]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/playing`)
      .on("value", (snapshot) => {
        if (snapshot.val()) playFirstSongOnQueue();
        else music.pause();
      });
  }, [firebase, music, roomKey, playFirstSongOnQueue]);

  const queueSong = (song: Song) =>
    firebase.database().ref("/rooms").child(roomKey).child("queue").push(song);

  const setSongStartTime = (time: number) =>
    firebase.database().ref(`rooms/${roomKey}/songStartTime`).set(time);

  const setRoomPlaying = (playing: boolean) =>
    firebase.database().ref(`rooms/${roomKey}/playing`).set(playing);

  const onClickPlay = async () => {
    const progress = await music.progress();
    await setSongStartTime(Date.now() - progress);
    setRoomPlaying(true);
  };

  const onClickPause = () => {
    setRoomPlaying(false);
  };

  return (
    <div>
      <h1>{`Welcome to ${roomName}`}</h1>
      <button onClick={() => setShowSearch(true)}>Search</button>
      <button onClick={onClickPlay}>Play</button>
      <button onClick={onClickPause}>Pause</button>

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
