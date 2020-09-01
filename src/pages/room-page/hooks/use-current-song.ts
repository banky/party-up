import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirebase } from "lib/firebase/hook";
import { useMusic } from "lib/music/hook";
import { Song } from "lib/music/types";

export const useCurrentSong = () => {
  const firebase = useFirebase();
  const music = useMusic();
  const { roomKey } = useParams();
  const [currentSong, setCurrentSong] = useState<Song | undefined>();

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/currentSong`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;
        music.queueAndPlay(snapshot.val()).catch((error) => {
          // TODO: Show some kind of error to the user if the song could not be queued
        });
        setCurrentSong(snapshot.val());
      });

    return () => firebase.database().ref(`rooms/${roomKey}/currentSong`).off();
  }, [firebase, music, roomKey]);

  return currentSong;
};
