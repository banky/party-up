import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase, useFirebaseState } from "../../lib/firebase/hooks";
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

  const [showSearch, setShowSearch] = useState(false);

  const [roomName] = useFirebaseState<string | null>(
    null,
    `rooms/${roomKey}/name`,
    (snapshot) => {
      if (!snapshot.exists()) return history.push("/not-found");
    }
  );

  const [roomPlaying, setRoomPlaying] = useFirebaseState(
    false,
    `rooms/${roomKey}/playing`,
    (snapshot) => {
      if (!snapshot.exists()) return;
      snapshot.val() ? music.play() : music.pause();
    }
  );

  const [currentSong, setCurrentSong] = useFirebaseState<Song | null>(
    null,
    `rooms/${roomKey}/currentSong`,
    (snapshot) => {
      if (!snapshot.exists()) return;
      // TODO: Prevent queue and play when the room is not playing somehow
      // Hard to do because if we don't queue the song, we can't play it later when user presses play

      music.queueAndPlay(snapshot.val());
    }
  );

  const setSongStartTimeFB = (time: number) =>
    firebase.database().ref(`rooms/${roomKey}/songStartTime`).set(time);

  const enqueueSongFB = (song: Song) =>
    firebase.database().ref(`/rooms/${roomKey}/queue`).push(song);

  const dequeueSongFB = (): Promise<Song> =>
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
    if (!currentSong) {
      const currentSong = await dequeueSongFB();
      setCurrentSong(currentSong);
    }

    const progress = await music.progress();
    await setSongStartTimeFB(Date.now() - progress);
    setRoomPlaying(true);
  };

  const onClickPause = () => {
    setRoomPlaying(false);
  };

  const onClickNext = async () => {
    const currentSong = await dequeueSongFB();
    setCurrentSong(currentSong);
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
            enqueueSongFB(song);
          }}
        />
      )}
    </div>
  );
};
