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
  const [currentSong, setCurrentSong] = useState<Song | undefined>();

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

        // TODO: Need to prevent playback if the room is not playing
        music.queueAndPlay(snapshot.val());
        setCurrentSong(snapshot.val());
      });
  }, [firebase, music, roomKey]);

  const queueSongFB = (song: Song) =>
    firebase.database().ref(`/rooms/${roomKey}/queue`).push(song);

  const setSongStartTimeFB = (time: number) =>
    firebase.database().ref(`rooms/${roomKey}/songStartTime`).set(time);

  const setRoomPlayingFB = (playing: boolean) =>
    firebase.database().ref(`rooms/${roomKey}/playing`).set(playing);

  const setCurrentSongFB = (song: Song) =>
    firebase.database().ref(`rooms/${roomKey}/currentSong`).set(song);

  const dequeueFB = (): Promise<Song> =>
    firebase
      .database()
      .ref(`rooms/${roomKey}/queue`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) return;

        const songList = snapshot.val();
        const songKeys = Object.keys(songList);

        const currentSong = songList[songKeys[0]];

        firebase
          .database()
          .ref(`rooms/${roomKey}/queue/${songKeys[0]}`)
          .remove();

        return currentSong;
      });

  const onClickPlay = async () => {
    // Only set current song if one doesn't exist already
    firebase
      .database()
      .ref(`rooms/${roomKey}/currentSong`)
      .once("value")
      .then(async (snapshot) => {
        if (snapshot.exists()) return;

        const currentSong = await dequeueFB();
        setCurrentSongFB(currentSong);
      });

    const progress = await music.progress();
    await setSongStartTimeFB(Date.now() - progress);
    setRoomPlayingFB(true);
  };

  const onClickPause = () => {
    setRoomPlayingFB(false);
  };

  const onClickNext = async () => {
    const currentSong = await dequeueFB();
    setCurrentSongFB(currentSong);
  };

  return (
    <div>
      <h1>{`Welcome to ${roomName}`}</h1>
      <QueueTitle onClickSearch={() => setShowSearch(true)} />

      <Queue roomKey={roomKey} />

      <NowPlaying
        song={currentSong}
        isPlaying={roomPlaying}
        onClickPlay={onClickPlay}
        onClickPause={onClickPause}
        onClickNext={onClickNext}
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
