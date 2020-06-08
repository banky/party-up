import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase } from "lib/firebase/hooks";
import { Song } from "lib/constants";
import { useMusic } from "lib/music-interface/hook";
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
  const [roomPlaying, setRoomPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | undefined>();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/name`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) return history.push("/not-found");
        setRoomName(snapshot.val());
      });
  }, [firebase, history, roomKey]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/playing`)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          music.play().catch((error) => {});
          setRoomPlaying(true);
        } else {
          music.pause().catch((error) => {});
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
        music.queueAndPlay(snapshot.val()).catch((error) => {
          // TODO: Show some kind of error to the user if the song could not be queued
        });
        setCurrentSong(snapshot.val());
      });
  }, [firebase, music, roomKey]);

  const setRoomPlayingFB = (playing: boolean) =>
    firebase.database().ref(`rooms/${roomKey}/playing`).set(playing);

  const setCurrentSongFB = (song: Song) =>
    firebase.database().ref(`rooms/${roomKey}/currentSong`).set(song);

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
    firebase
      .database()
      .ref(`rooms/${roomKey}/currentSong`)
      .once("value")
      .then(async (snapshot) => {
        if (snapshot.exists()) return;

        const currentSong = await dequeueSongFB();
        setCurrentSongFB(currentSong);
      });

    setRoomPlayingFB(true);
  };

  const onClickPause = () => {
    setRoomPlayingFB(false);
  };

  const onClickNext = async () => {
    const currentSong = await dequeueSongFB();
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
            enqueueSongFB(song);
          }}
        />
      )}
    </div>
  );
};
