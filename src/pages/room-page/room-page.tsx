import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useFirebase } from "lib/firebase/hooks";
import { Song } from "lib/constants";
import { useMusic } from "lib/music-interface/hook";
import { RootState } from "store/reducers";
import { updateDestinationRoomKey } from "store/actions";
import { Search } from "./components/search";
import { Queue } from "./components/queue";
import { NowPlaying } from "./components/now-playing";
import { QueueTitle } from "./components/queue-title";
import "./room-page.css";

// TODO: Break apart this "god" component with custom hooks
export const RoomPage = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const music = useMusic();
  const history = useHistory();

  const [roomName, setRoomName] = useState("");
  const [roomPlaying, setRoomPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | undefined>();
  const [showSearch, setShowSearch] = useState(false);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [userIsDj, setUserIsDj] = useState(false);

  const userPressedNext = useRef(false);

  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userId);
  const musicAuthToken = useSelector(
    (state: RootState) => state.musicAuthToken
  );
  const musicAuthTokenExpiry = useSelector(
    (state: RootState) => state.musicAuthTokenExpiry
  );

  useEffect(() => {
    const userIsValid =
      musicAuthToken.length > 0 && Date.now() < musicAuthTokenExpiry;

    if (!userIsValid) {
      dispatch(updateDestinationRoomKey(roomKey));
      history.push("/");
    } else {
      dispatch(updateDestinationRoomKey());
    }
  }, [dispatch, history, musicAuthToken, musicAuthTokenExpiry, roomKey]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/name`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) return history.push("/not-found");
        setRoomName(snapshot.val());
      })
      .catch((error) => {
        console.warn(error);
      });
  }, [firebase, history, roomKey]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/owner`)
      .on("value", (snapshot) => {
        setUserIsOwner(userId === snapshot.val());
      });
  }, [firebase, roomKey, userId]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/djs`)
      .on("value", (snapshot) => {
        const djs = snapshot.val();
        setUserIsDj(!!djs[userId]);
      });
  }, [firebase, roomKey, userId]);

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

  const setRoomPlayingFB = useCallback(
    (playing: boolean) =>
      firebase.database().ref(`rooms/${roomKey}/playing`).set(playing),
    [firebase, roomKey]
  );

  const setCurrentSongFB = useCallback(
    (song: Song) =>
      firebase.database().ref(`rooms/${roomKey}/currentSong`).set(song),
    [firebase, roomKey]
  );

  const enqueueSongFB = useCallback(
    (song: Song) =>
      firebase.database().ref(`/rooms/${roomKey}/queue`).push(song),
    [firebase, roomKey]
  );

  const dequeueSongFB = useCallback(
    (): Promise<Song> =>
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
        })
        .catch((error) => {
          console.warn(error);
        }),
    [firebase, roomKey]
  );

  useEffect(() => {
    music.songEnded(async () => {
      // Only do this if the song ended on its own
      if (userPressedNext.current) {
        userPressedNext.current = false;
        return;
      }

      // Only the room owner should control automatic next
      if (!userIsOwner) return;

      const currentSong = await dequeueSongFB();
      setCurrentSongFB(currentSong);
    });
  }, [music, userIsOwner, dequeueSongFB, setCurrentSongFB]);

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
      })
      .catch((error) => {
        console.warn(error);
      });

    setRoomPlayingFB(true);
  };

  const onClickPause = () => {
    setRoomPlayingFB(false);
  };

  const onClickNext = async () => {
    userPressedNext.current = true;
    const currentSong = await dequeueSongFB();
    setCurrentSongFB(currentSong);
  };

  return (
    <div>
      <h1>{`Welcome to ${roomName}`}</h1>
      <QueueTitle
        userIsDj={userIsDj}
        onClickSearch={() => setShowSearch(true)}
      />

      <Queue roomKey={roomKey} userIsDj={userIsDj} />

      <NowPlaying
        song={currentSong}
        isPlaying={roomPlaying}
        userIsDj={userIsDj}
        onClickPlay={onClickPlay}
        onClickPause={onClickPause}
        onClickNext={onClickNext}
      />

      {showSearch && (
        <Search
          userIsDj={userIsDj}
          cancelSearch={() => setShowSearch(false)}
          onSelectSong={(song) => {
            enqueueSongFB(song);
          }}
        />
      )}
    </div>
  );
};
