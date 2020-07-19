import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "lib/firebase/hooks";
import { useMusic } from "lib/music-interface/hook";
import { Search } from "./components/search";
import { Queue } from "./components/queue";
import { NowPlaying } from "./components/now-playing";
import { QueueTitle } from "./components/queue-title";
import {
  useUserAuthorized,
  useRoomName,
  useUserIsOwner,
  useUserIsDj,
  useRoomPlaying,
  useCurrentSong,
  useFirebaseActions,
} from "./hooks";
import { DjBooth } from "./components/dj-booth";
import styled from "styled-components";

export const RoomPage = () => {
  const firebase = useFirebase();
  const music = useMusic();
  const { roomKey } = useParams();
  const [showSearch, setShowSearch] = useState(false);
  const userPressedNext = useRef(false);

  const roomName = useRoomName();
  const userIsOwner = useUserIsOwner();
  const userIsDj = useUserIsDj();
  const roomPlaying = useRoomPlaying();
  const currentSong = useCurrentSong();
  const {
    setRoomPlayingFB,
    setCurrentSongFB,
    enqueueSongFB,
    dequeueSongFB,
  } = useFirebaseActions();

  useUserAuthorized();

  useEffect(() => {
    if (!userIsOwner) {
      // Don't do anything if the user isn't
      // or is no longer the owner
      music.songEnded(() => {});
    } else {
      music.songEnded(async () => {
        // Only do this if the song ended on its own
        if (userPressedNext.current) {
          userPressedNext.current = false;
          return;
        }

        const currentSong = await dequeueSongFB();
        setCurrentSongFB(currentSong);
      });
    }
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
      <RoomWrapper>
        <DjBoothWrapper>
          <DjBooth />
        </DjBoothWrapper>

        <QueueWrapper>
          <QueueTitle
            userIsDj={userIsDj}
            onClickSearch={() => setShowSearch(true)}
          />

          <Queue roomKey={roomKey} userIsDj={userIsDj} />
        </QueueWrapper>

        <MessagesWrapper>{/* For messages */}</MessagesWrapper>
      </RoomWrapper>

      <NowPlaying
        song={currentSong}
        isPlaying={roomPlaying}
        userIsOwner={userIsOwner}
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

const RoomWrapper = styled.div`
  display: flex;
`;

const DjBoothWrapper = styled.div`
  flex: 2 1 200px;
  padding: 0 20px;
`;

const QueueWrapper = styled.div`
  flex: 2 1 700px;
`;

const MessagesWrapper = styled.div`
  flex: 2 1 200px;
`;
