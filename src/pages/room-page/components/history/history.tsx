import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "lib/firebase/hook";
import { Song } from "lib/music/types";
import { MediaCard } from "components/media-card/media-card.component";
import { MediaQueue, MediaQueueItem } from "components/media-queue";
import { useEnqueueSongFirebase } from "hooks/use-enqueue-song-firebase";

export const History = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();
  const [songHistory, setSongHistory] = useState<Song[]>([]);
  const enqueueSongFirebase = useEnqueueSongFirebase();

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/history`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        const songHistoryQueue = Object.values<Song>(snapshot.val());

        // History should be ordered from newest to oldest
        const songHistoryStack = songHistoryQueue.reverse();
        setSongHistory(songHistoryStack);
      });

    return () => firebase.database().ref(`rooms/${roomKey}/history`).off();
  }, [firebase, roomKey]);

  const onClickAddSong = useCallback(
    async (song) => {
      await enqueueSongFirebase(song);
    },
    [enqueueSongFirebase]
  );

  return (
    <MediaQueue>
      {songHistory.map((song) => {
        return (
          <MediaQueueItem key={song.url}>
            <MediaCard
              title={song.name}
              subtitle={song.artist}
              imageUrl={song.smallImage}
              imageAlt={`${song.name} album cover`}
              actionIcon="plus"
              actionDisabled={false}
              onClickActionIcon={() => {
                onClickAddSong(song);
              }}
            />
          </MediaQueueItem>
        );
      })}
    </MediaQueue>
  );
};
