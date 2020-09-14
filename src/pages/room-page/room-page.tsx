import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useFirebase } from "lib/firebase/hook";
import { useMusic } from "lib/music/hook";
import { useUserAuthorized } from "hooks/use-user-authorized";
import { Header } from "components/header/header.component";
import { TabSwitcher } from "components/tab-switcher/tab-switcher";
import { Search } from "./components/search";
import { NowPlaying } from "./components/now-playing";
import {
  useRoomName,
  useUserIsOwner,
  useRoomPlaying,
  useCurrentSong,
  useFirebaseActions,
  useProgress,
  useDequeueSongFb,
} from "./hooks";
import { DjBooth } from "./components/dj-booth";
import { YourQueue } from "./components/your-queue";

const TABS = {
  History: () => null,
  "Your Queue": YourQueue,
  Playlists: () => null,
  Search: Search,
};

export const RoomPage = () => {
  const firebase = useFirebase();
  const music = useMusic();
  const { roomKey } = useParams<{ roomKey: string }>();
  const userPressedNext = useRef(false);
  const [switcherValue, setSwitcherValue] = useState(1);

  const roomName = useRoomName();
  const userIsOwner = useUserIsOwner();
  const roomPlaying = useRoomPlaying();
  const currentSong = useCurrentSong();
  const { setRoomPlayingFB, setCurrentSongFB } = useFirebaseActions();
  const dequeueSongFB = useDequeueSongFb();
  const progress = useProgress();

  useUserAuthorized();

  useEffect(() => {
    if (!userIsOwner) {
      // Don't do anything if the user isn't
      // or is no longer the owner
      return music.songEnded(() => {});
    } else {
      return music.songEnded(async () => {
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

  const SongList = useMemo(() => Object.values(TABS)[switcherValue], [
    switcherValue,
  ]);

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
    <>
      <Header title={roomName} />
      <RoomPageWrapper>
        <TabSwitcher
          tabs={Object.keys(TABS)}
          value={switcherValue}
          setValue={setSwitcherValue}
        />
        <RoomContentWrapper>
          <DjBoothWrapper>
            <DjBooth />
          </DjBoothWrapper>

          <SongListWrapper>
            <SongList />
          </SongListWrapper>

          <MessagesWrapper>{/* For messages */}</MessagesWrapper>
        </RoomContentWrapper>

        <NowPlaying
          song={currentSong}
          isPlaying={roomPlaying}
          userIsOwner={userIsOwner}
          progress={progress}
          onClickPlay={onClickPlay}
          onClickPause={onClickPause}
          onClickNext={onClickNext}
        />
      </RoomPageWrapper>
    </>
  );
};

const RoomPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 40px; /* Height of the header :( */
`;

const RoomContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  overflow: auto;
`;

const DjBoothWrapper = styled.div`
  flex: 2 1 200px;
  padding: 0 20px;
`;

const SongListWrapper = styled.div`
  overflow: auto;
  flex: 2 1 700px;
`;

const MessagesWrapper = styled.div`
  flex: 2 1 200px;
`;
