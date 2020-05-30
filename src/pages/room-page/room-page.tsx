import React, { useState, useEffect } from "react";
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
      .on("value", async (snapshot) => {
        if (snapshot.val()) {
          music.play();
          setRoomPlaying(true);
        } else {
          music.pause();
          setRoomPlaying(false);
        }
      });
  }, [firebase, music, roomKey]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/currentSong`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        // TODO: Only do this if the room is playing
        music.queueAndPlay(snapshot.val());
      });
  }, [firebase, music, roomKey]);

  const queueSongFB = (song: Song) =>
    firebase.database().ref(`/rooms/${roomKey}/queue`).push(song);

  const setSongStartTimeFB = (time: number) =>
    firebase.database().ref(`rooms/${roomKey}/songStartTime`).set(time);

  const setRoomPlayingFB = (playing: boolean) =>
    firebase.database().ref(`rooms/${roomKey}/playing`).set(playing);

  const onClickPlay = async () => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/currentSong`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) return;

        firebase
          .database()
          .ref(`rooms/${roomKey}/queue`)
          .once("value", async (snapshot) => {
            if (!snapshot.exists()) return;

            const songList = snapshot.val();
            const songKeys = Object.keys(songList);
            const currentSong: Song = songList[songKeys[0]];

            firebase
              .database()
              .ref(`rooms/${roomKey}/currentSong`)
              .set(currentSong);
          });
      });

    const progress = await music.progress();
    await setSongStartTimeFB(Date.now() - progress);
    setRoomPlayingFB(true);
  };

  const onClickPause = () => {
    setRoomPlayingFB(false);
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
            queueSongFB(song);
          }}
        />
      )}
    </div>
  );
};
