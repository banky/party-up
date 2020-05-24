import React, { useState, useEffect } from "react";
import { Song } from "../../../lib/constants";
import { SongCard } from "../../../components/song-card/song-card.component";
import { useFirebase } from "../../../lib/firebase/hooks";

type QueueProps = {
  roomKey: string;
};

export const Queue = ({ roomKey }: QueueProps) => {
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
  }, [firebase, roomKey]);

  return (
    <ul className="song-queue">
      {Object.keys(playQueue).map((songKey) => {
        const song = playQueue[songKey];

        return (
          <li className="song-queue-item" key={song.url}>
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
          </li>
        );
      })}
    </ul>
  );
};
