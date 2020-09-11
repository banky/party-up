import React, { useState, useEffect, useCallback } from "react";
import { SongQueue, SongQueueItem } from "../song-queue";
import { SongCard } from "components/song-card/song-card.component";
import { Song } from "lib/music/types";
import { useFirebase } from "lib/firebase/hook";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { useParams } from "react-router-dom";

export const YourQueue = () => {
  const [songList, setSongList] = useState<{ [key: string]: Song }>({});
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);
  const { roomKey } = useParams();

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/queues/${userId}`)
      .on("value", (snapshot) => {
        const snapshotVal = snapshot.exists() ? snapshot.val() : {};
        setSongList(snapshotVal);
      });

    return () =>
      firebase.database().ref(`rooms/${roomKey}/queues/${userId}`).off();
  }, [firebase, roomKey, userId]);

  const onPressSongCard = useCallback(
    (songKey: string) => {
      firebase
        .database()
        .ref(`rooms/${roomKey}/queues/${userId}/${songKey}`)
        .remove();
    },
    [firebase, roomKey, userId]
  );

  return (
    <SongQueue>
      {Object.keys(songList).map((songKey) => {
        const song = songList[songKey];

        return (
          <SongQueueItem key={song.url}>
            <SongCard
              song={song}
              actionIcon="minus"
              actionDisabled={false}
              onClickActionIcon={() => onPressSongCard(songKey)}
            />
          </SongQueueItem>
        );
      })}
    </SongQueue>
  );
};
