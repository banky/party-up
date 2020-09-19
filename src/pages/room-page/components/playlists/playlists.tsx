import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useMusic } from "lib/music/hook";
import { Playlist } from "lib/music/types";
import { MediaCard } from "components/media-card/media-card.component";
import { MediaQueue, MediaQueueItem } from "components/media-queue";
import { useFirebase } from "lib/firebase/hook";
import { RootState } from "store/reducers";

export const Playlists = () => {
  const music = useMusic();
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();
  const userId = useSelector((state: RootState) => state.userId);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    music.getPlaylists().then((p) => setPlaylists(p));
  }, [music]);

  const onClickAddPlaylist = useCallback(
    async (playlist: Playlist) => {
      const songs = await music.getSongsForPlaylist(playlist);

      songs.forEach((song) => {
        firebase.database().ref(`rooms/${roomKey}/queues/${userId}`).push(song);
      });
    },
    [firebase, roomKey, userId]
  );

  return (
    <MediaQueue>
      {playlists.map((playlist) => {
        return (
          <MediaQueueItem key={playlist.id}>
            <MediaCard
              title={playlist.name}
              subtitle={playlist.description}
              imageUrl={playlist.image || ""}
              imageAlt={`${playlist.name} playlist cover image`}
              actionIcon="plus"
              actionDisabled={false}
              onClickActionIcon={() => {
                onClickAddPlaylist(playlist);
              }}
            />
          </MediaQueueItem>
        );
      })}
    </MediaQueue>
  );
};
