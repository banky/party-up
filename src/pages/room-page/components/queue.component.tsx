import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Song } from "lib/constants";
import { SongCard } from "components/song-card/song-card.component";
import { useFirebase } from "lib/firebase/hooks";
import { useMusic } from "lib/music-interface/hook";

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
};

export const Queue = ({ roomKey }: QueueProps) => {
  const [displayQueue, setDisplayQueue] = useState<{ [key: string]: Song }>({});
  const firebase = useFirebase();
  const music = useMusic();

  useEffect(() => {
    music.onSongEnd(() => {
      setDisplayQueue(music.getQueue());
    });
  }, []);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/queue`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) {
          setDisplayQueue({});
          return;
        }

        setDisplayQueue(snapshot.val());
        music.setQueue(Object.values(snapshot.val()));
      });
  }, [firebase, roomKey]);

  return (
    <SongQueue>
      {Object.keys(displayQueue).map((songKey) => {
        const song = displayQueue[songKey];

        return (
          <SongQueueItem key={song.uri}>
            <SongCard
              song={song}
              actionIcon="minus"
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
