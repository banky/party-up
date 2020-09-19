import React, { useCallback, useEffect, useState } from "react";
import { useMusic } from "lib/music/hook";
import { Playlist } from "lib/music/types";
import { MediaCard } from "components/media-card/media-card.component";
import { MediaQueue, MediaQueueItem } from "components/media-queue";
import { useEnqueueSongFirebase } from "hooks/use-enqueue-song-firebase";

export const Playlists = () => {
  const music = useMusic();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const enqueueSongFirebase = useEnqueueSongFirebase();

  useEffect(() => {
    music.getPlaylists().then((p) => setPlaylists(p));
  }, [music]);

  const onClickAddPlaylist = useCallback(
    async (playlist: Playlist) => {
      const songs = await music.getSongsForPlaylist(playlist);

      songs.forEach((song) => {
        enqueueSongFirebase(song);
      });
    },
    [music, enqueueSongFirebase]
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
