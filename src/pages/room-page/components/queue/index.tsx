import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Song } from "lib/types";
import { SongCard } from "components/song-card/song-card.component";
import { useFirebase } from "lib/firebase/hooks";

const SongQueue = styled.ul`
  padding: 0;
  margin: auto;
  margin-bottom: 100px;
  max-width: 700px;
  list-style-type: none;
`;

const SongQueueItem = styled.li`
  margin-top: 15px;
  margin-bottom: 15px;
`;

type QueueProps = {
  roomKey: string;
  userIsDj: boolean;
};

export const Queue = ({ roomKey, userIsDj }: QueueProps) => {
  const [playQueue, setPlayQueue] = useState<{ [key: string]: Song }>({});
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/queue`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) {
          setPlayQueue({});
          return;
        }

        setPlayQueue(snapshot.val());
      });

    return () => firebase.database().ref(`rooms/${roomKey}/queue`).off();
  }, [firebase, roomKey]);

  return (
    <SongQueue>
      {Object.keys(playQueue).map((songKey) => {
        const song = playQueue[songKey];

        return (
          <SongQueueItem key={song.url}>
            <SongCard
              song={song}
              actionIcon="minus"
              actionDisabled={!userIsDj}
              onClickActionIcon={() => {
                firebase
                  .database()
                  .ref(`rooms/${roomKey}/queue/${songKey}`)
                  .remove();
              }}
            />
          </SongQueueItem>
        );
      })}
    </SongQueue>
  );
};
