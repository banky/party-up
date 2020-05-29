import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase } from "../../lib/firebase/hooks";
import { Song } from "../../lib/constants";
import { useMusic } from "../../lib/music-interface/hook";
import { Search } from "./components/search.component";
import { Queue } from "./components/queue.component";
import { NowPlaying } from "./components/now-playing.component";
import { QueueTitle } from "./components/queue-title.component";
import "./room-page.css";

export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const music = useMusic();
  const history = useHistory();

  const [roomName, setRoomName] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [roomPlaying, setRoomPlaying] = useState(false);

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

        await music.play(currentSong);
        music.seek(songCurrentTime);
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
        if (snapshot.val()) {
          playFirstSongOnQueue();
          setRoomPlaying(true);
        } else {
          music.pause();
          setRoomPlaying(false);
        }
      });
  }, [firebase, music, roomKey, playFirstSongOnQueue]);

  const queueSong = (song: Song) =>
    firebase.database().ref("/rooms").child(roomKey).child("queue").push(song);

  const setSongStartTime = (time: number) =>
    firebase.database().ref(`rooms/${roomKey}/songStartTime`).set(time);

  const setFirebaseRoomPlaying = (playing: boolean) =>
    firebase.database().ref(`rooms/${roomKey}/playing`).set(playing);

  const onClickPlay = async () => {
    const progress = await music.progress();
    await setSongStartTime(Date.now() - progress);
    setFirebaseRoomPlaying(true);
  };

  const onClickPause = () => {
    setFirebaseRoomPlaying(false);
  };

  return (
    <div>
      <h1>{`Welcome to ${roomName}`}</h1>
      <QueueTitle onClickSearch={() => setShowSearch(true)} />

      <Queue roomKey={roomKey} />

      <NowPlaying
        song={{
          name: "song song",
          artist: "artist artist",
          album: "album album",
          imgUrl:
            "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/5f/5f/54/5f5f5492-bc5a-3a38-3bcf-ec5e59bb6c84/886447991824.jpg/100x100bb.jpeg",
          url: "song.com",
          isrc: "123123123",
        }}
        isPlaying={roomPlaying}
        onClickPlay={onClickPlay}
        onClickPause={onClickPause}
        onClickNext={() => {}}
      />

      {showSearch && (
        <Search
          cancelSearch={() => setShowSearch(false)}
          onSelectSong={(song) => {
            queueSong(song);
          }}
        />
      )}
    </div>
  );
};
